import { create } from "domain"
import { setTooltip } from "obsidian"
import { start } from "repl"
import { Issue } from "../../Model/Issue"
import { GanttTask } from "./GanttTask"
import { navDateLine } from "./NavDateLine"


export class Gantt {
    private tasks: GanttTask[]
    private startDate: Date
    private endDate: Date


    private getStartDate(tasks: GanttTask[]) {
        const result: number[] = tasks.map((item) => new Date(item.startDate).getTime());
        return new Date(Math.min(...result))
    }

    private getEndDate(tasks: GanttTask[]) {
        const result: number[] = tasks.map((item) => new Date(item.endDate).getTime());
        return new Date(Math.max(...result))
    }

    private * generateYears(startDate: Date, endDate: Date, filterHalf: boolean = false) {
        yield new Date(startDate)

        if (startDate >= endDate) { return }

        const pointer = new Date(startDate)
        pointer.setDate(1)
        pointer.setMonth(1)
        pointer.setFullYear(pointer.getFullYear() + 1)

        const monthDelta = 1

        const rightEquality = new Date(endDate)
        if (filterHalf) { rightEquality.setMonth(rightEquality.getMonth() - monthDelta) }

        const leftEquality = new Date(startDate)
        if (filterHalf) { leftEquality.setMonth(leftEquality.getMonth() + monthDelta) }

        while (pointer < rightEquality) {

            if (filterHalf && pointer < leftEquality) { pointer.setFullYear(pointer.getFullYear() + 1); continue }

            yield new Date(pointer)
            pointer.setFullYear(pointer.getFullYear() + 1)

        }

        yield new Date(endDate)
    }

    private * generateMonthes(startDate: Date, endDate: Date, filterHalf: boolean = false) {
        const monthes = endDate.getMonth() - endDate.getMonth() + (endDate.getFullYear() - startDate.getFullYear()) * 12

        if (monthes > 10) {
            yield* this.generateYears(startDate, endDate, filterHalf)
            return
        }

        yield new Date(startDate)

        if (startDate >= endDate) { return }

        const pointer = new Date(startDate)
        pointer.setDate(1)
        pointer.setMonth(pointer.getMonth() + 1)

        const daysDelta = 15

        const rightEquality = new Date(endDate)
        if (filterHalf) { rightEquality.setDate(rightEquality.getDate() - daysDelta) }

        const leftEquality = new Date(startDate)
        if (filterHalf) { leftEquality.setDate(leftEquality.getDate() + daysDelta) }

        while (pointer < rightEquality) {
            if (filterHalf && pointer < leftEquality) { pointer.setMonth(pointer.getMonth() + 1); continue }

            yield new Date(pointer)
            pointer.setMonth(pointer.getMonth() + 1)

        }

        yield new Date(endDate)
    }

    constructor(tasks: GanttTask[]) {
        this.tasks = tasks

        this.startDate = this.getStartDate(this.tasks)
        this.endDate = this.getEndDate(this.tasks)
    }


    private getRelativeDate(date: Date) {
        const absoluteTime: number = this.endDate.getTime() - this.startDate.getTime()
        const timeCoeff = 100 / absoluteTime

        return (date.getTime() - this.startDate.getTime()) * timeCoeff
    }


    public getElement(): HTMLDivElement {
        const wrapper = createDiv({ attr: { class: "yti-gantt-wrapper" } })

        //Margin divs for date lines
        //-------------------------------------------------------
        const marginDivUp = createDiv({ attr: { class: "yti-gant-margin-up" } })

        const marginDivDown = createDiv({ attr: { class: "yti-gant-margin-bottom" } })
        //-------------------------------------------------------

        //Date navigation lines
        //-------------------------------------------------------
        for (let item of this.generateMonthes(this.startDate, this.endDate, true)) {
            // const dateNav = navDateLine(item, this.getRelativeDate(item));
            // wrapper.appendChild(dateNav)
        }
        //-------------------------------------------------------

        // Main content
        //-------------------------------------------------------
        wrapper.appendChild(marginDivUp)
        this.tasks.forEach(task => {
            try {
                const task_line = createDiv({ attr: { class: "yti-gantt-task-line" } })
                task_line.appendChild(task.getElement(this.startDate, this.endDate))
                wrapper.appendChild(task_line)
            } catch (err) {
                console.error("Не смог сгенерировать строку диаграммы Ганта из-за ошибки: ", err)
            }
        })
        wrapper.appendChild(marginDivDown)
        //-------------------------------------------------------



        return wrapper
    }
}