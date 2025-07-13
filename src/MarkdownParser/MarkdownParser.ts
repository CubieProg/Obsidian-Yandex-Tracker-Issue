import { Plugin } from 'obsidian';
import { YTClient } from '../YTClient';
import { Issue } from '../Model/Issue';
import { DisplayAttribute, YTISettings } from '../Settings/Settings';
import { Board } from '../Model/Board';

export class MarkdownParser {

    private yTClient: YTClient;
    private plugin: Plugin;
    private settings: YTISettings;

    constructor(yTClient: YTClient, plugin: Plugin, settings: YTISettings) {
        this.yTClient = yTClient
        this.plugin = plugin
        this.settings = settings

        this.registerProcessors()
    }


    private extract(entity: Object, entityType: any, displayAttribute: DisplayAttribute) {

        if (!(displayAttribute.firstLayer in entityType.complexFiedls)) {
            return entity[displayAttribute.firstLayer]
        }

        const field = displayAttribute.secondLayer ?
            displayAttribute.secondLayer :
            entityType.complexFiedls[displayAttribute.firstLayer].mainField


        if (
            displayAttribute.firstLayer in entityType.complexFiedls &&
            field in entity[displayAttribute.firstLayer]
        ) {
            return entity[displayAttribute.firstLayer][field]
        }
    }

    private registerProcessors() {
        this.plugin.registerMarkdownCodeBlockProcessor('yt-issue', async (source, el, ctx) => {
            this.issueProcessor(source, el, ctx)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-boards', async (source, el, ctx) => {
            this.boardProcessor(source, el, ctx)
        })


    }

    private async boardProcessor(source, el: HTMLElement, ctx): Promise<void> {

        const display_attrs = this.settings.data.boardAttrs.filter(item => item.firstLayer in Board.aliases)

        const content_lines: string[] = source.split('\n');
        const boards_tasks: Promise<Board>[] = content_lines.map(
            (line: string) => this.yTClient.getBoard(line, true, display_attrs.map(item => item.firstLayer))
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = "BOARDS"
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: Board.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = Board.aliases[item.firstLayer]

            if (item.secondLayer && Board.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${Board.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })

        for (let task of boards_tasks) {
            const board_res = await task;

            const board_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = board_res[item.firstLayer]
                try {
                    display_data = this.extract(board_res, Board, item)
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: board_line })
                column.innerHTML = display_data
                board_line.appendChild(column)
            })
            body.appendChild(board_line)
        }

        el.appendChild(table)
    }

    private async issueProcessor(source, el: HTMLElement, ctx): Promise<void> {
        // const display_attrs = ["status", "priority", "previousStatus", "type"]
        //     .filter(item => item in Issue.aliases)

        // const display_attrs = ["updatedBy", "createdBy", "assignee", "project", "queue", "parent", "sprint"]
        //     .filter(item => item in Issue.aliases)


        // const display_attrs = this.settings.data.issueAttrs.contains('all') ?
        //     Object.keys(Issue.aliases) :
        //     this.settings.data.issueAttrs.filter(item => item.firstLayer in Issue.aliases)


        const display_attrs = this.settings.data.issueAttrs.filter(item => item.firstLayer in Issue.aliases)

        const content_lines: string[] = source.split('\n');
        const issues_tasks: Promise<Issue>[] = content_lines.map(
            (line: string) => this.yTClient.getIssue(line, true, display_attrs.map(item => item.firstLayer))
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = "ISSUES"
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)


        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: Issue.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = Issue.aliases[item.firstLayer]

            if (item.secondLayer && Issue.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${Issue.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })



        for (let task of issues_tasks) {
            const issue_res = await task;

            const issue_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = issue_res[item.firstLayer]
                try {

                    display_data = this.extract(issue_res, Issue, item)
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