import { requestUrl, RequestUrlResponsePromise } from "obsidian"
import { SettingsData } from "../Settings/Settings"
import { API, FailResponse, isFailResponse } from './APIBase'
import ts from "typescript";


// Шлёт одиночные типизированные запросы

export function isFail(response: any) {
    if (response !== undefined && response.data !== undefined && response.data === "Fail") { return true }
    return false
}

export class YTAPI {

    private settingsData: SettingsData

    private host: string;
    private engine: string;
    private baseURL: string;

    private api: API;

    constructor(settingsData: SettingsData) {
        this.settingsData = settingsData

        this.host = "https://api.tracker.yandex.net"
        this.engine = 'v3'

        this.baseURL = this.host + "/" + this.engine + "/"

        this.api = new API();
    }


    private buildHeaders() {
        return {
            "Authorization": "OAuth " + this.settingsData.oauth,
            "X-Org-ID": this.settingsData.orgId
        }
    }

    private async requestWrapper(
        resource_type: string,
        resource_id: string | null = null,
        parameters: null = null,
        skipRetry: boolean = false
    ): Promise<Object> {
        const isResourceId: boolean = typeof resource_id === 'string' && resource_id.length > 0
        const isParameters: boolean = false

        const url: string = this.baseURL +
            `${resource_type}` +
            (isResourceId ? `/${resource_id}` : ``) +
            (isParameters ? `/some code here` : ``)

        const headers = this.buildHeaders()

        const response = await this.api.request(url, headers, skipRetry)


        if (isFailResponse(response)) {
            return { data: "Fail", response: response }
        }
        return await response.json
    }

    public async requestBoard(boardId: string) {
        return await this.requestWrapper("boards", boardId)
    }

    public async requestIssue(issueId: string) {
        let issue = await this.requestWrapper("issues", issueId)
        if (issue["project"] !== undefined && issue["project"]["primary"] !== undefined) {
            issue["project"] = issue["project"]["primary"]
        }
        if (issue["sprint"] !== undefined && issue["sprint"].length > 0) {
            issue["sprint"] = issue["sprint"][0]
        }

        return issue
    }

    public async requestProject(projectId: string) {
        return await this.requestWrapper("projects", projectId)
    }

    public async requestSprint(sprintId: string) {
        return await this.requestWrapper("sprints", sprintId)
    }

    public async requestQueue(queueId: string) {
        return await this.requestWrapper("queues", queueId)
    }

    public async requestUser(userId: string) {
        return await this.requestWrapper("users", userId)
    }

    public async requestStatus(statusId: string) {
        return await this.requestWrapper('statuses', statusId)
    }

    public async requestPriority(priorityId: string) {
        return await this.requestWrapper('priorities', priorityId)
    }

    public async requestIssueType(issueTypeId: string) {
        return await this.requestWrapper('issuetypes', issueTypeId)
    }


    public async requestMe() {
        return await this.requestWrapper("myself")
    }

    public async requestTest() {
        return await this.requestWrapper("myself", null, null, true)
    }

    public async testReq() {
        let a = this.api.request(this.baseURL + "boards", this.buildHeaders())
    }



    public async testFail() {
        return await this.api.request(this.baseURL + "fail", this.buildHeaders())
    }

    public async testUnauth() {
        return await this.api.request(this.baseURL + "boards", {})
    }

}