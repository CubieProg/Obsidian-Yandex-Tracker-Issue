import { requestUrl } from "obsidian"
import { SettingsData } from "../Settings/Settings"


export class API {

    private OAuth: string;
    private OrgID: string;
    private baseURL: string;

    constructor(settingsData: SettingsData) {
        this.OAuth = settingsData.oauth
        this.OrgID = settingsData.orgId
        this.baseURL = 'https://api.tracker.yandex.net/v3/issues/'
    }

    private convertIssueID(issueID: string){
        return `<a href="https://tracker.yandex.ru/${issueID}"> ${issueID} </a>`
    }

    private convertName(name: string) {
        const splitted = name.split(" ")
        const firstName = splitted[0]
        const fatherName = splitted[1]
        const lastName = splitted[2]

        return firstName[0] + '.' + (fatherName[0] ? (fatherName[0]  + '. ') : ' ') + lastName
    }

    private convertSummary(summary: string, firstN: number = 20){
        const trimmed = summary.trim().substring(0, firstN);

        if (trimmed.length < summary.trim().length){
            return trimmed + "..."
        }

        return trimmed
    }

    public async requestIssue(issueID: string) {
        try {
            const URL = this.baseURL + issueID + `?expand=attachments`

            const json_resp = await requestUrl({
                url: URL,
                method: "GET",
                headers: {
                    "Authorization": "OAuth " + this.OAuth,
                    "X-Org-ID": this.OrgID
                },
            })
                .then(async (response) => {
                    return (await response.json)
                })
                .catch(err => {

                })

            // return '<div>' + json_resp['summary'] + '</div>'
            return `<tr>
                <td> ${this.convertIssueID(issueID)} </td>
                <td> ${this.convertSummary(json_resp['summary'])} </td>
                <td> ${json_resp['statusStartTime'].split('T')[0]} </td>
                <td> ${this.convertName(json_resp['assignee']['display'])} </td>
                <td> ${json_resp['status']['display']} </td>
            </tr>`
        } catch {
            return ""
        }
    }
}