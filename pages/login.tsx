import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Spin, Form, Input } from "antd";
import styles from "@/styles/login.module.css";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { isAuthorized, signIn } from "../util/user-util";
import { useMediaQuery } from "react-responsive";
const { TextArea } = Input;

export default function Login() {
  console.log("Rendering");
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const router = useRouter();
  const [displayError, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (isAuthorized()) {
      router.push("/home");
    }
  }, []);

  const handleSubmit = (values: any) => {
    localStorage.clear();
    setLoading(true);
    signIn(values.username, values.password)
      .then((result) => {
        setLoading(false);
        const currentdate = new Date();
        localStorage.setItem("username", values.username);
        localStorage.setItem("id_token", result.AuthenticationResult.IdToken);
        localStorage.setItem("session_time", currentdate.toString());
        localStorage.setItem("tenant_id", result.user.tenant.tenantId);
        localStorage.setItem("access_token", result.AuthenticationResult.AccessToken);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("user_name", result.user.username);
        console.log("Session Token Saved.");
        router.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        setError(`Sign in Error: ${error}`);
      });
  };
  const handleActivate = () => {
    router.push("/activate-account");
  };
  return (
    <div>
      <div className={styles.app}>
        <div className={styles.title}>Football Login</div>
        <div>
          <Form name="basic" labelCol={{ span: 8 }} initialValues={{ remember: true }} onFinish={handleSubmit} autoComplete="off">
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
              <Input className={styles.inputBox} />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
              <Input.Password className={styles.inputBox} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <div className={styles.bottomLink}>
                {" "}
                <div>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
                <div>
                  {isLoading ? (
                    <div>
                      {" "}
                      <div>
                        &emsp;&emsp;&emsp;&emsp;
                        <Spin indicator={antIcon}>
                          <div className="content" />
                        </Spin>
                      </div>
                    </div>
                  ) : (
                    <div>&emsp;</div>
                  )}
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.bottomLink}>
          {isMobile ? (
            <></>
          ) : (
            <>
              <div className={styles.space}></div>
            </>
          )}
          <div>
            <Button type="link" block onClick={handleActivate}>
              Activate Account
            </Button>
          </div>
        </div>
        <div>
          {displayError ? (
            <>
              <div className={styles.bottomLink}>
                <div className={styles.space}></div>
                <div className={styles.error}>SignIn operation failed. Please check if your usrname and password is correct.</div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
