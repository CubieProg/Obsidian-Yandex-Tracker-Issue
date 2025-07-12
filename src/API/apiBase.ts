import { requestUrl, RequestUrlResponsePromise } from "obsidian"
import { StatusCode, status_codes } from "./StatusCodes";
import { delay } from "../utils";

// Шлёт одиночные запросы с отказоучтойчивостью

export type FailResponse = {
    statusCode: StatusCode
}


export const isFailResponse = (x: FailResponse | any): x is FailResponse => (x as FailResponse).statusCode !== undefined;

export class API {

    private retries: number = 10;
    private delayMultiplier: number = 150;

    constructor() { }

    public async request(
        URL: string,
        headers: Record<string, string>,
        skipRetry: boolean = false,
        retries: number = 0
    ): Promise<RequestUrlResponsePromise | FailResponse> {
        if (retries > this.retries || (retries >= 1 && skipRetry)) {
            return { statusCode: status_codes[0] } as FailResponse
        }

        const response = await requestUrl({
            url: URL,
            method: "GET",
            headers: headers
        }).catch(
            async (err) => {
                console.error(err)
                await delay((retries + 1) * this.delayMultiplier)
                return await this.request(URL, headers, skipRetry, retries + 1)
            }
        )

        return response
    }

    // private convertIssueID(issueID: string) {
    //     return `<a href="https://tracker.yandex.ru/${issueID}"> ${issueID} </a>`
    // }

    // private convertName(name: string) {
    //     const splitted = name.split(" ")
    //     const firstName = splitted[0]
    //     const fatherName = splitted[1]
    //     const lastName = splitted[2]

    //     return firstName[0] + '.' + (fatherName[0] ? (fatherName[0] + '. ') : ' ') + lastName
    // }

    // private convertSummary(summary: string, firstN: number = 20) {
    //     const trimmed = summary.trim().substring(0, firstN);

    //     if (trimmed.length < summary.trim().length) {
    //         return trimmed + "..."
    //     }

    //     return trimmed
    // }

    // public async requestBoards() {
    //     const URL = this.baseURL + 'boards'

    //     const json_resp = await (await this.request(URL)).json

    //     console.log(json_resp)

    // }

    // public async requestQueues() {
    //     const URL = this.baseURL + 'queues'

    //     const json_resp = await (await this.request(URL)).json

    //     let string_data = "<table>"

    //     string_data += `
    //         <tr>
    //             <th scope="col">Название очереди</th>
    //             <th scope="col">Лид</th>
    //         </tr>
    //     `

    //     for (let item of json_resp) {

    //         string_data += '<tr>'
    //         string_data += '<td>' + item['name'] + '</td>'
    //         string_data += '<td>' + this.convertName(item['lead']['display']) + '</td>'
    //         string_data += '</tr>'
    //     }

    //     return string_data + "</table>"

    //     // return `<div> ${JSON.stringify(json_resp)} </div>`
    // }

    // public async requestFields() {
    //     const URL = this.baseURL + 'fields'

    //     const json_resp = await (await this.request(URL)).json

    //     return `<div> ${JSON.stringify(json_resp)} </div>`
    // }

    // public async requestBoard(boardID: string) {
    //     if (boardID.length <= 0) {
    //         return ""
    //     }

    //     const URL = this.baseURL + 'boards/' + boardID

    //     const json_resp = await (await this.request(URL)).json

    //     // console.log(1)
    //     // console.log(boardID)
    //     // console.log(json_resp['name'])
    //     // console.log(2)

    //     return `<tr>
    //             <td> ${this.convertSummary(json_resp['name'], 30)} </td>
    //             <td> ${json_resp['createdAt'].split('T')[0]} </td>
    //             <td> ${this.convertName(json_resp['createdBy']['display'])} </td>
    //         </tr>`
    // }

    // public async requestIssue(issueID: string) {
    //     try {

    //         const URL = this.baseURL + 'issues/' + issueID + `?expand=attachments`

    //         const json_resp = await (await this.request(URL)).json


    //         return `<tr>
    //             <td> ${this.convertIssueID(issueID)} </td>
    //             <td> ${this.convertSummary(json_resp['summary'])} </td>
    //             <td> ${json_resp['statusStartTime'].split('T')[0]} </td>
    //             <td> ${this.convertName(json_resp['assignee']['display'])} </td>
    //             <td> ${json_resp['status']['display']} </td>
    //         </tr>`
    //     } catch {
    //         return ""
    //     }
    // }
}