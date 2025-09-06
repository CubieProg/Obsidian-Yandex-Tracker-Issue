import { setTooltip } from "obsidian"
import { Issue } from "../../Model/Issue"
import { text } from "stream/consumers"

export class GanttTask {
    private issue: Issue

    public readonly taskId: string
    public readonly name: string

    public readonly startDate: Date
    public readonly endDate: Date

    public readonly color: string

    constructor(issue: Issue, startDate: Date, endDate: Date, color: string = "") {
        this.issue = issue

        this.taskId = issue.key
        this.name = issue.summary

        this.startDate = startDate
        this.endDate = endDate

        this.color = color
    }

    private generateTooltipText() {
        return this.name + "\n\n" + "Статус: " + this.issue.status.display
    }


    public getElement(absoluteStart: Date, absoluteEnd: Date) {

        const absoluteTime: number = absoluteEnd.getTime() - absoluteStart.getTime()

        const timeCoeff = 100 / absoluteTime

        const relativeStart: number = (this.startDate.getTime() - absoluteStart.getTime()) * timeCoeff
        const relativeWidth: number = (this.endDate.getTime() - this.startDate.getTime()) * timeCoeff

        const wrapper = createDiv({ attr: { class: `yti-gantt-task-wrapper` } })
        const issueLink = createDiv({ attr: { class: `yti-gantt-task-issue-link-div` } })
        const issueAnchor = createEl('a', {
            href: `https://tracker.yandex.ru/${this.taskId}`,
            text: this.taskId
        })

        issueLink.appendChild(issueAnchor)

        const ganttWrapper = createDiv({ attr: { class: `yti-gantt-task-other-wrapper` } })

        const ganttElement = createDiv({
            attr: {
                class: "yti-gantt-task-element"
            }
        })

        ganttElement.style.setProperty("--yti-gantt-task-offset", `${relativeStart}%`);
        ganttElement.style.setProperty("--yti-gantt-task-width", `${relativeWidth}%`);


        const textWrapper = createEl('div', {
            attr: { class: "yti-gantt-task-text-wrapper" },
            text: this.name
        })

        setTooltip(textWrapper, this.generateTooltipText())

        ganttElement.appendChild(textWrapper)

        ganttWrapper.appendChild(ganttElement)

        wrapper.appendChild(issueLink)
        wrapper.appendChild(ganttWrapper)

        return wrapper
    }
}