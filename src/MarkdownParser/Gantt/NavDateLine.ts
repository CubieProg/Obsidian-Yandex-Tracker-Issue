
export const navDateLine = (date: Date, offset: number) => {

    const dateNav = createDiv({
        attr: {
            class: "yti-gantt-navline-datenav",
            style: `margin-left: ${offset}%;`
        }
    })

    const line = createDiv({ attr: { class: "yti-gantt-navline-line" } })

    const dateText = createDiv({ 
        attr: { class: "yti-gantt-navline-text" }, 
        text: date.toLocaleDateString()
    })

    const wrapper = createDiv({ attr: { class: "yti-gantt-navline-wrapper" } })



    dateNav.appendChild(line)
    dateNav.appendChild(dateText)

    wrapper.appendChild(dateNav)

    return wrapper
}
