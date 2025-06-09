import { prepareGetRequest, preparePostRequest } from "@/util/request-helper";

export async function queryFootballData(startYear: number, endYear: number, teamNameList: string, kpiName: string) {
    const createUserUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/query_kpi_from_csv`);
    // Split team names by comma and trim whitespace
    const teamNames = teamNameList ? teamNameList.split(',').map(name => name.trim()) : [];
    const attributCreate = {
        "StartYear": startYear,
        "EndYear": endYear,
        "TeamNameList": teamNames,
        "KPIName": kpiName
    };
    const requestParams = preparePostRequest(JSON.stringify(attributCreate));
    try {
        const response = await fetch(createUserUrl, requestParams);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        if (result.error) {
            throw new Error(result.message);
        }
        return result;
    } catch (error) {
        console.error('Error fetching football data:', error);
        throw error;
    }
}
  