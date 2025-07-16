
export const navDateLine = (date: Date, offset: number) => {

    const dateNav = createDiv({
        attr: {
            class: "gantt-navline-datenav",
            style: `margin-left: ${offset}%;`
        }
    })

    const line = createDiv({ attr: { class: "gantt-navline-line" } })

    const dateText = createDiv({ attr: { class: "gantt-navline-text" } })

    const wrapper = createDiv({ attr: { class: "gantt-navline-wrapper" } })


    dateText.innerHTML = date.toLocaleDateString()

    dateNav.appendChild(line)
    dateNav.appendChild(dateText)

    wrapper.appendChild(dateNav)

    return wrapper
}
