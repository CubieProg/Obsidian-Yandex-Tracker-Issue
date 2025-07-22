import { MarkdownPostProcessor, MarkdownPostProcessorContext, MarkdownPreviewRenderer, Plugin } from 'obsidian';
import { DisplayAttribute, YTISettings } from '../Settings/Settings';
import { YTClient } from '../YTClient';
import { Issue } from '../Model/Issue';
import { Board } from '../Model/Board';
import { Queue } from '../Model/Queue';
import { Project } from '../Model/Project';
import { Sprint } from '../Model/Sprint';
import { User } from '../Model/User';
import { IYaTrDTO } from '../Model/UtilTypes/IYaTrDTO';
import { ModifyerParser } from './ModifyerParser';
import { Gantt } from './Gantt/Gantt';
import { GanttTask } from './Gantt/GanttTask.ts';



export class MarkdownParser {
    private yTClient: YTClient;
    private plugin: Plugin;
    private settings: YTISettings;
    private modifyerParser: ModifyerParser;

    private postprocessors: MarkdownPostProcessor[];

    constructor(yTClient: YTClient, plugin: Plugin, settings: YTISettings) {
        this.yTClient = yTClient
        this.plugin = plugin
        this.settings = settings

        this.postprocessors = new Array<MarkdownPostProcessor>();
        this.modifyerParser = new ModifyerParser()

        this.registerProcessors()
    }

    public unregisterProcessors() {
        for (let processor of this.postprocessors) {
            MarkdownPreviewRenderer.unregisterPostProcessor(processor)
        }
    }

    public rerender() {
        for (let processor of this.postprocessors) {
            MarkdownPreviewRenderer.unregisterPostProcessor(processor)
            this.plugin.registerMarkdownPostProcessor(processor)
        }
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
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-issue', (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Issue, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-boards', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Board, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-queues', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Queue, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-projects', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Project, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-sprints', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Sprint, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-users', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, User, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-gantt', async (source, el, ctx) => {
            this.ganttProcessor(source, el, ctx, false)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-issue-query', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Issue, true)
        }))
        this.postprocessors.push(this.plugin.registerMarkdownCodeBlockProcessor('yt-gantt-query', async (source, el, ctx) => {
            this.ganttProcessor(source, el, ctx, true)
        }))
    }

    private processNonImplementedEntities(entity: any): string | undefined {
        if (Array.isArray(entity)) {
            return entity.map(item => this.processNonImplementedEntities(item)).join(", ")
        }

        if (typeof entity === 'object' && 'display' in entity) {
            return entity.display
        }

        return entity
    }

    private generateNoDataText() {
        return "Н/Д"
    }

    private async entityProcessor<T>(
        source: string,
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
        entityClass: {
            new(): T,
            aliases: Object,
            complexFiedls: Object
        },
        query: boolean = false
    ) {
        const instance: T = new entityClass()
        const className: string = (instance as IYaTrDTO).DTOName
        const class_name: string = className.toLowerCase()

        const display_attrs = this.settings.data[`${class_name}Attrs`].filter(item => item.firstLayer in entityClass.aliases)

        let entities_tasks: Promise<T>[] | T[]

        if (query) {
            entities_tasks = (await this.yTClient.getQuery(source)) as T[]
        } else {
            const content_lines: string[] = source.split('\n');
            entities_tasks = content_lines.map(
                (line: string) => this.yTClient[`get${className}`](
                    line,
                    true,
                    display_attrs.map(item => item.firstLayer)
                )
            )
        }

        const table = createEl('table')

        const caption = createEl('caption', {
            attr: { text: "test caption" },
            parent: table,
            text: className
        })
        table.appendChild(caption)

        const head = createEl('thead', { parent: table })
        const head_line = createEl('tr', { parent: head })
        head.appendChild(head_line)
        table.appendChild(head)

        const body = createEl('tbody', { parent: table })
        table.appendChild(body)

        el.appendChild(table)

        display_attrs.forEach((item: DisplayAttribute) => {
            let column_name = entityClass.aliases[item.firstLayer]

            if (item.secondLayer && entityClass.complexFiedls.hasOwnProperty(item.firstLayer)) {
                column_name += `.${entityClass.complexFiedls[item.firstLayer].DTOType.aliases[item.secondLayer]}`
            }

            const column = createEl('th', {
                attr: { text: entityClass.aliases[item.firstLayer] },
                parent: head_line,
                text: column_name
            })

            head_line.appendChild(column)
        })

        for (let task of entities_tasks) {
            const entity_res = await task;

            const entity_line = createEl('tr', { parent: body })

            display_attrs.forEach((item: DisplayAttribute) => {
                let display_data = entity_res[item.firstLayer]
                try {
                    display_data = this.extract(entity_res as Object, entityClass, item)
                    display_data = this.processNonImplementedEntities(display_data)
                    display_data = this.modifyerParser.process(display_data, item)
                } catch {
                    display_data = undefined // "В Бобруйск!"
                }

                if (!display_data && display_data !== "" && display_data !== false && display_data !== 0) {
                    display_data = this.generateNoDataText()
                }

                const column = createEl('td', {
                    attr: { text: display_data },
                    parent: entity_line,
                    text: typeof (display_data) === 'string' ? display_data : ""
                })

                if (display_data instanceof HTMLElement) {
                    column.appendChild(display_data)
                }

                entity_line.appendChild(column)
            })
            body.appendChild(entity_line)
        }
    }

    private getTerminationDate(issue: Issue) {
        if (this.settings.data.ganttTerminationStatuses.contains(issue.status.key)) {
            return new Date(issue.updatedAt)
        }

        return new Date()
    }

    private async ganttProcessor(
        source: string,
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
        query: boolean = false
    ) {
        let tasks: GanttTask[]

        if (query) {
            tasks = (await this.yTClient.getQuery(source))
                .filter(issue => issue && issue.id && issue.key)
                .map(item => new GanttTask(item, new Date(item.createdAt), this.getTerminationDate(item)))
        } else {
            const content_lines: string[] = source.split('\n');

            tasks = (await Promise.all(content_lines.map((line: string) => this.yTClient.getIssue(line, true))))
                .filter(issue => issue && issue.id && issue.key)
                .map(item => new GanttTask(item, new Date(item.createdAt), this.getTerminationDate(item)))

        }

        const gantt = new Gantt(tasks);
        const marginGantt = createDiv({ attr: { class: "processor-gantt-margin-bottom" } })

        el.appendChild(gantt.getElement())
        el.appendChild(marginGantt)
    }
}