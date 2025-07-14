import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { YTClient } from '../YTClient';
import { Issue } from '../Model/Issue';
import { DisplayAttribute, YTISettings } from '../Settings/Settings';
import { Board } from '../Model/Board';
import { Queue } from '../Model/Queue';
import { Project } from '../Model/Project';
import { Sprint } from '../Model/Sprint';
import { User } from '../Model/User';
import { IYaTrDTO } from '../Model/UtilTypes/IYaTrDTO';

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
            this.genericProcessor(source, el, ctx, Issue)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-boards', async (source, el, ctx) => {
            this.genericProcessor(source, el, ctx, Board)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-queues', async (source, el, ctx) => {
            this.genericProcessor(source, el, ctx, Queue)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-projects', async (source, el, ctx) => {
            this.genericProcessor(source, el, ctx, Project)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-sprints', async (source, el, ctx) => {
            this.genericProcessor(source, el, ctx, Sprint)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-users', async (source, el, ctx) => {
            this.genericProcessor(source, el, ctx, User)
        })
    }

    private async genericProcessor<T>(
        source: string,
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
        entityClass: {
            new(): T,
            aliases: Object,
            complexFiedls: Object
        }
    ) {
        const instance: T = new entityClass()
        const iinstance: IYaTrDTO = instance as IYaTrDTO
        const className: string = (instance as IYaTrDTO).DTOName
        const class_name: string = className.toLowerCase()


        const display_attrs = this.settings.data[`${class_name}Attrs`].filter(item => item.firstLayer in entityClass.aliases)

        const content_lines: string[] = source.split('\n');
        const entities_tasks: Promise<T>[] = content_lines.map(
            (line: string) => this.yTClient[`get${className}`](
                line,
                true,
                display_attrs.map(item => item.firstLayer)
            )
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = className
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: entityClass.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = entityClass.aliases[item.firstLayer]

            if (item.secondLayer && entityClass.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${entityClass.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })

        for (let task of entities_tasks) {
            const entity_res = await task;

            const entity_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = entity_res[item.firstLayer]
                try {
                    display_data = this.extract(entity_res as Object, entityClass, item)
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: entity_line })
                column.innerHTML = display_data
                entity_line.appendChild(column)
            })
            body.appendChild(entity_line)
        }

        el.appendChild(table)
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
        const display_attrs = this.settings.data.queueAttrs.filter(item => item.firstLayer in Queue.aliases)

        const content_lines: string[] = source.split('\n');
        const queues_tasks: Promise<Queue>[] = content_lines.map(
            (line: string) => this.yTClient.getQueue(line, true, display_attrs.map(item => item.firstLayer))
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = "QUEUES"
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: Queue.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = Queue.aliases[item.firstLayer]

            if (item.secondLayer && Queue.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${Queue.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })

        for (let task of queues_tasks) {
            const queue_res = await task;

            const queue_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = queue_res[item.firstLayer]
                try {
                    display_data = this.extract(queue_res, Queue, item)
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: queue_line })
                column.innerHTML = display_data
                queue_line.appendChild(column)
            })
            body.appendChild(queue_line)
        }

        el.appendChild(table)
    }

    private async projectProcessor(source, el, ctx) {
        const display_attrs = this.settings.data.projectAttrs.filter(item => item.firstLayer in Project.aliases)

        const content_lines: string[] = source.split('\n');
        const projects_tasks: Promise<Project>[] = content_lines.map(
            (line: string) => this.yTClient.getProject(line, true, display_attrs.map(item => item.firstLayer))
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = "PROJECTS"
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: Project.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = Project.aliases[item.firstLayer]

            if (item.secondLayer && Project.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${Project.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })

        for (let task of projects_tasks) {
            const project_res = await task;

            const project_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = project_res[item.firstLayer]
                try {
                    display_data = this.extract(project_res, Project, item)
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: project_line })
                column.innerHTML = display_data
                project_line.appendChild(column)
            })
            body.appendChild(project_line)
        }

        el.appendChild(table)
    }

    private async sprintProcessor(source, el, ctx) {

        const display_attrs = this.settings.data.sprintAttrs.filter(item => item.firstLayer in Sprint.aliases)

        const content_lines: string[] = source.split('\n');
        const sprints_tasks: Promise<Sprint>[] = content_lines.map(
            (line: string) => this.yTClient.getSprint(line, true, display_attrs.map(item => item.firstLayer))
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = "SPRINTS"
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: Sprint.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = Sprint.aliases[item.firstLayer]

            if (item.secondLayer && Sprint.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${Sprint.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })

        for (let task of sprints_tasks) {
            const sprint_res = await task;

            const sprint_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = sprint_res[item.firstLayer]
                try {
                    display_data = this.extract(sprint_res, Sprint, item)
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: sprint_line })
                column.innerHTML = display_data
                sprint_line.appendChild(column)
            })
            body.appendChild(sprint_line)
        }

        el.appendChild(table)
    }

    private async userProcessor(source, el, ctx) {

        const display_attrs = this.settings.data.userAttrs.filter(item => item.firstLayer in User.aliases)

        const content_lines: string[] = source.split('\n');
        const users_tasks: Promise<User>[] = content_lines.map(
            (line: string) => this.yTClient.getUser(line, true, display_attrs.map(item => item.firstLayer))
        )

        const table = createEl('table')

        const caption = createEl('caption', { attr: { text: "test caption" }, parent: table })
        caption.innerHTML = "USERS"
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        display_attrs.forEach((item: DisplayAttribute) => {

            const column = createEl('th', { attr: { text: User.aliases[item.firstLayer] }, parent: head_line })
            column.innerHTML = User.aliases[item.firstLayer]

            if (item.secondLayer && User.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column.innerHTML += `.${User.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            head_line.appendChild(column)
        })

        for (let task of users_tasks) {
            const user_res = await task;

            const user_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = user_res[item.firstLayer]
                try {
                    display_data = this.extract(user_res, User, item)
                } catch {
                    display_data = "В Бобруйск!"
                }

                const column = createEl('td', { attr: { text: display_data }, parent: user_line })
                column.innerHTML = display_data
                user_line.appendChild(column)
            })
            body.appendChild(user_line)
        }

        el.appendChild(table)
    }

    private async testProcessor(source, el, ctx) {

    }
}