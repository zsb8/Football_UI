import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/home.module.css";
import { Divider, Menu, Button, Input, Space, Layout, Flex, Form, Select, Tag } from "antd";
import { LogoutOutlined, CloseOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import FootballLogo from "@/public/FootballLogo.png";
import { useMediaQuery } from "react-responsive";
import { isAuthorized } from "@/util/user-util";
import { queryFootballData } from "@/util/football-util";
import { Column } from '@ant-design/plots';

export default function HomeDisplay() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const router = useRouter();
  const { Content } = Layout;
  const [displayError, setError] = useState<string | null>(null);
  const [loadings, setLoadings] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showTeamNames, setShowTeamNames] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthorization = () => {
      if (!isAuthorized()) {
        router.push("/login");
      }
    };
    checkAuthorization();
    // Check every one hour. If timeout, it will log out automatically.
    const interval = setInterval(checkAuthorization, 3000);
    return () => clearInterval(interval);
  }, [router]);

  // Load teams from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('team_names');
    if (savedTeams) {
      const teams = JSON.parse(savedTeams);
      setAvailableTeams(teams);
      setShowTeamNames(true);
    } else {
      setShowTeamNames(false);
    }
  }, []);

  const handleSubmit = async (values: any) => {
    setLoadings(true);
    try {
      const result = await queryFootballData(
        values.startYear,
        values.endYear,
        values.teamName || "",
        values.kpiName
      );
      console.log('Football data result:', result);
      
      // Extract unique team names and save to localStorage only if team_names doesn't exist
      const uniqueTeams = Array.from(new Set(result.Result.map((item: any) => item.teamName))) as string[];
      localStorage.setItem('football_data', JSON.stringify(result.Result));
      
      // Only set team_names if it doesn't exist
      if (!localStorage.getItem('team_names')) {
        localStorage.setItem('team_names', JSON.stringify(uniqueTeams));
        setAvailableTeams(uniqueTeams);
        setShowTeamNames(true);
      }

      // Calculate average for each team
      const teamAverages = result.Result.reduce((acc: any, curr: any) => {
        if (!acc[curr.teamName]) {
          acc[curr.teamName] = {
            teamName: curr.teamName,
            total: 0,
            count: 0
          };
        }
        acc[curr.teamName].total += curr[values.kpiName];
        acc[curr.teamName].count += 1;
        return acc;
      }, {});

      // Convert to array and calculate averages
      const processedData = Object.values(teamAverages).map((team: any) => ({
        teamName: team.teamName,
        average: team.total / team.count
      }));

      // Sort by average in descending order
      processedData.sort((a: any, b: any) => b.average - a.average);

      // Transform back to the format expected by the chart
      const chartData = result.Result.map((item: any) => ({
        ...item,
        year: item.year.toString()
      }));

      // Sort the chart data based on the team order from processedData
      const teamOrder = processedData.map((team: any) => team.teamName);
      chartData.sort((a: any, b: any) => {
        return teamOrder.indexOf(a.teamName) - teamOrder.indexOf(b.teamName);
      });

      setChartData(chartData);
      setSelectedKPI(values.kpiName);
      setLoadings(false);
    } catch (error: any) {
      setError(`Error: ${error.message}`);
      setLoadings(false);
    }
  };

  const handleTeamSelect = (value: string) => {
    if (value === 'all') {
      // Select all available teams
      setSelectedTeams([...availableTeams]);
      setAvailableTeams([]);
      form.setFieldsValue({ teamName: '' });
    } else {
      setSelectedTeams([...selectedTeams, value]);
      setAvailableTeams(availableTeams.filter(team => team !== value));
      form.setFieldsValue({ teamName: [...selectedTeams, value].join(', ') });
    }
  };

  const handleTeamRemove = (teamToRemove: string) => {
    // Remove from selected teams
    const newSelectedTeams = selectedTeams.filter(team => team !== teamToRemove);
    setSelectedTeams(newSelectedTeams);
    
    // Add back to available teams
    setAvailableTeams([...availableTeams, teamToRemove]);
    
    // Update form value - if no teams selected, set empty string
    form.setFieldsValue({ teamName: newSelectedTeams.length > 0 ? newSelectedTeams.join(', ') : '' });
  };

  const items: MenuProps["items"] = [
    {
      label: "Team KPI Analysis",
      key: "home",
      disabled: false,
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      disabled: false,
    },
  ];

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('id_token');
    localStorage.removeItem('session_time');
    localStorage.removeItem('football_data');
    localStorage.removeItem('team_names');
    // Clear any other potential data
    localStorage.clear();
    router.push("/login");
  };
  
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    switch (e.key) {
      case "home": {
        router.push({ pathname: "/home" });
        break;
      }
      case "logout": {
        handleLogout();
        break;
      }
      default:
        console.log("default");
    }
  };

  const getChartConfig = () => {
    const kpiLabel = {
      'won': 'Matches Won',
      'draw': 'Matches Drawn',
      'lost': 'Matches Lost',
      'goalsFor': 'Goals For',
      'goalsAgainst': 'Goals Against'
    }[selectedKPI] || selectedKPI;

    return {
      data: chartData,
      xField: 'teamName',
      yField: selectedKPI,
      seriesField: 'year',
      isGroup: true,
      columnStyle: {
        radius: [20, 20, 0, 0],
      },
      label: {
        position: 'top',
      },
      legend: {
        position: 'top',
        itemName: {
          formatter: (text: string) => `Season ${text}`,
        },
      },
      colorField: 'year',
      color: ['#1890ff', '#52c41a'],
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        [selectedKPI]: {
          alias: kpiLabel,
        },
        year: {
          alias: 'Season',
        },
      },
    };
  };

  const handleReset = () => {
    // Reset form
    form.resetFields();
    // Reset selected teams
    setSelectedTeams([]);
    // Reset available teams from localStorage
    const savedTeams = localStorage.getItem('team_names');
    if (savedTeams) {
      const teams = JSON.parse(savedTeams);
      setAvailableTeams(teams);
    }
  };

  return (
    <div className={styles.fontHelvetica}>
      {displayError ? (
        <div>
          <p>{displayError}</p>
        </div>
      ) : (
        <>
          <div className={styles.total}>
            <div>
              {isMobile ? (
                <>
                  <div className={styles.rightAlignButton}>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout} size="large">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.header}>
                    <div className={styles._left}>
                      <div style={{ padding: '10px 0', display: 'flex', alignItems: 'center' }}>
                        <Image 
                          src={FootballLogo} 
                          className={styles.logo} 
                          alt="Football Logo" 
                          priority 
                          width={60}
                          height={25}
                          style={{ 
                            objectFit: 'contain',
                            maxWidth: '100%',
                            height: 'auto',
                            marginTop: '-8px'
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles._right}>
                      <Menu onClick={onClick} mode="horizontal" items={items} className={styles.menu} />
                    </div>
                  </div>
                </>
              )}
              <Divider />
              <div className={styles.chatInterface}>
                <Content style={{ padding: "2rem" }}>
                  <Flex>
                    <div style={{ width: '400px' }}>
                      <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                      >
                        <Form.Item
                          label="Start Year"
                          name="startYear"
                          rules={[
                            { required: true, message: 'Please select start year!' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const endYear = getFieldValue('endYear');
                                if (!endYear || !value || value <= endYear) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('Start year cannot be later than end year!'));
                              },
                            }),
                          ]}
                        >
                          <Select placeholder="Select start year">
                            {Array.from({ length: 5 }, (_, i) => 2020 + i).map(year => (
                              <Select.Option key={year} value={year}>{year}</Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          label="End Year"
                          name="endYear"
                          rules={[
                            { required: true, message: 'Please select end year!' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const startYear = getFieldValue('startYear');
                                if (!startYear || !value || startYear <= value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('End year cannot be earlier than start year!'));
                              },
                            }),
                          ]}
                          dependencies={['startYear']}
                        >
                          <Select placeholder="Select end year">
                            {Array.from({ length: 5 }, (_, i) => 2020 + i).map(year => (
                              <Select.Option key={year} value={year}>{year}</Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {showTeamNames && (
                          <Form.Item
                            label="Team Names"
                            name="teamName"
                          >
                            <div>
                              <Select
                                placeholder="Select teams"
                                style={{ width: '100%' }}
                                onChange={handleTeamSelect}
                                value={undefined}
                              >
                                <Select.Option key="all" value="all">
                                  Choose All
                                </Select.Option>
                                {availableTeams.map(team => (
                                  <Select.Option key={team} value={team}>
                                    {team}
                                  </Select.Option>
                                ))}
                              </Select>
                              <div style={{ marginTop: '8px' }}>
                                {selectedTeams.map(team => (
                                  <Tag
                                    key={team}
                                    closable
                                    onClose={() => handleTeamRemove(team)}
                                    style={{ marginBottom: '4px' }}
                                  >
                                    {team}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          </Form.Item>
                        )}

                        <Form.Item
                          label="KPI"
                          name="kpiName"
                          rules={[
                            { required: true, message: 'Please select a KPI!' },
                          ]}
                        >
                          <Select placeholder="Select KPI">
                            <Select.Option value="won">Matches Won</Select.Option>
                            <Select.Option value="draw">Matches Drawn</Select.Option>
                            <Select.Option value="lost">Matches Lost</Select.Option>
                            <Select.Option value="goalsFor">Goals For</Select.Option>
                            <Select.Option value="goalsAgainst">Goals Against</Select.Option>
                          </Select>
                        </Form.Item>

                        <Form.Item>
                          <Space>
                            <Button type="primary" htmlType="submit" loading={loadings}>
                              Analyze
                            </Button>
                            <Button onClick={handleReset}>
                              Reset
                            </Button>
                          </Space>
                        </Form.Item>
                      </Form>
                    </div>
                    <div style={{ flex: 1, marginLeft: '2rem' }}>
                      {chartData.length > 0 && (
                        <Column {...getChartConfig()} />
                      )}
                    </div>
                  </Flex>
                </Content>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
