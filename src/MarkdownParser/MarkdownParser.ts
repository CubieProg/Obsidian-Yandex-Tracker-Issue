import { Plugin } from 'obsidian';
import { YTClient } from '../YTClient';
import { Issue } from '../Model/Issue';
import { text } from 'stream/consumers';

export class MarkdownParser {

    private yTClient: YTClient;
    private plugin: Plugin;

    constructor(yTClient: YTClient, plugin: Plugin) {
        this.yTClient = yTClient
        this.plugin = plugin

        this.registerProcessors()
    }

    private registerProcessors() {
        this.plugin.registerMarkdownCodeBlockProcessor('yt-issue', async (source, el, ctx) => {
            this.issueProcessor(source, el, ctx)
        })


    }

    private async issueProcessor(source, el: HTMLElement, ctx): Promise<void> {
        // const display_attrs = ["status", "priority", "previousStatus", "type"]
        //     .filter(item => item in Issue.alieses)

        const display_attrs = ["updatedBy", "createdBy", "assignee", "project", "queue", "parent", "sprint"]
            .filter(item => item in Issue.alieses)

        const content_lines: string[] = source.split('\n');
        const issues_tasks: Promise<Issue>[] = content_lines.map(
            (line: string) => this.yTClient.getIssue(line, true, display_attrs)
        )

        const table = createEl('table')

        // const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        // caption.innerHTML = "ISSUES"
        // table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)


        display_attrs.forEach((item: string) => {

            const column = createEl('th', { attr: { text: Issue.alieses[item] }, parent: head_line })
            column.innerHTML = Issue.alieses[item]

            head_line.appendChild(column)
        })



        for (let task of issues_tasks) {
            const issue_res = await task;

            const issue_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: string) => {
                let display_data = issue_res[item]
                try {
                    if (item in Issue.complexFiedls && Issue.complexFiedls[item].mainField in issue_res[item]) {
                        display_data = issue_res[item][Issue.complexFiedls[item].mainField]
                    }
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: issue_line })
                column.innerHTML = display_data
                issue_line.appendChild(column)
            })
            body.appendChild(issue_line)
        }

        el.appendChild(table)
    }

    private async queueProcessor(source, el, ctx) {

    }

    private async userProcessor(source, el, ctx) {

    }

    private async testProcessor(source, el, ctx) {

    }
}



// public async requestBoard(boardId: string) {
//     const response = await this.requestWrapper("boards", boardId)
//     console.log(response)
// }

// public async requestIssue(issueId: string) {
//     const response = await this.requestWrapper("issues", issueId)
//     console.log(response)
// }

// public async requestQueue(queueId: string) {
//     const response = await this.requestWrapper("queues", queueId)
//     console.log(response)
// }

// public async requestUser(userId: string) {
//     const response = await this.requestWrapper("users", userId)
//     console.log(response)
// }

// public async requestMe() {
//     const response = await this.requestWrapper("myself")
//     console.log(response)
// }