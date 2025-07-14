import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
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

export class MarkdownParser {
    private yTClient: YTClient;
    private plugin: Plugin;
    private settings: YTISettings;
    private modifyerParser: ModifyerParser;

    constructor(yTClient: YTClient, plugin: Plugin, settings: YTISettings) {
        this.yTClient = yTClient
        this.plugin = plugin
        this.settings = settings

        this.modifyerParser = new ModifyerParser()

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
            this.entityProcessor(source, el, ctx, Issue)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-boards', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Board)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-queues', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Queue)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-projects', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Project)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-sprints', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, Sprint)
        })
        this.plugin.registerMarkdownCodeBlockProcessor('yt-users', async (source, el, ctx) => {
            this.entityProcessor(source, el, ctx, User)
        })
    }

    private async entityProcessor<T>(
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
                    display_data = this.modifyerParser.process(display_data, item)
                } catch {
                    display_data = "В Бобруйск!"
                }


                const column = createEl('td', { attr: { text: display_data }, parent: entity_line })
                
                
                if (display_data instanceof HTMLElement) {
                    column.appendChild(display_data)
                } else {
                    column.innerHTML = display_data
                }

                entity_line.appendChild(column)

            })
            body.appendChild(entity_line)
        }

        el.appendChild(table)
    }

    private async testProcessor(source, el, ctx) {

    }
}