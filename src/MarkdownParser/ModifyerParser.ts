import { DisplayAttribute } from "../Settings/Settings"


export class ModifyerParser {
    public process(data: any, displayAttribute: DisplayAttribute) {
        displayAttribute.modifyers.forEach(mod => {
            const modifyer = this.findModifyer(mod.modifyerName)

            if (modifyer) {
                data = this.modifyers[modifyer](data, mod.args)
            }
        })

        return data
    }


    private findModifyer(modifyer: string): string | undefined {
        for (let key in this.modifyers) {
            if (key === modifyer) { return key }
        }
    }

    private readonly modifyers: object = {
        "initials": this.initialsProcessor,
        "trim": this.trimProcessor,
        "yesno": this.yesnoProcessor,
        "link": this.linkProcessor,
        "ytlink": this.ytlinkProcessor,
        "boardlink": this.boardlinkProcessor,
        "projectlink": this.projectlinkProcessor,
        "log": this.logProcessor,
        "date": this.dateProcessor,
        "time": this.timeProcessor,
    }


    // Соглашение для написания проверок:
    //      left -- аргумент для полей объекта this.modifyers
    //      right -- аргумент для прилетающего модификатора в виде строки

    private equalCheck(left: string, right: string) {
        return left === right
    }

    private startsWithCheck(left: string, right: string) {
        return right.startsWith(left)
    }



    // Обработчики

    private initialsProcessor(data: string, ...args: string[]) {
        const tokens = data.replace(/\s+/g, ' ').split(" ")

        return tokens.reduce((acc: string, curr: string, idx: number, array: string[]) => {
            if (idx >= array.length - 1) {
                return acc + (acc ? " " + curr : curr)
            }
            return acc + curr[0] + '.'
        }, "")
    }

    private trimProcessor(data: string, ...args: string[]) {
        try {
            const trim_word_length = "trim".length
            const word_length = Number(args[0]) //Number(modifyerKey.substring(trim_word_length, modifyerKey.length))

            if (word_length >= data.length) { return data }
            return data.substring(0, word_length) + '...'
        } catch {
            return data
        }
    }

    private yesnoProcessor(data: any, ...args: string[]) {
        if (data) { return "Да" }
        return "Нет"
    }

    private linkProcessor(data: string, ...args: string[]) {
        const anchor: HTMLAnchorElement = createEl('a', {
            href: data,
            text: data
        })
        return anchor
    }

    private ytlinkProcessor(data: string, ...args: string[]) {
        const anchor: HTMLAnchorElement = createEl('a', {
            href: 'https://tracker.yandex.ru/' + data,
            text: data
        })
        return anchor
    }

    private boardlinkProcessor(data: string, ...args: string[]) {
        const anchor: HTMLAnchorElement = createEl('a', {
            href: 'https://tracker.yandex.ru/agile/board/' + data,
            text: data
        })
        return anchor
    }

    private projectlinkProcessor(data: string, ...args: string[]) {
        const anchor: HTMLAnchorElement = createEl('a', {
            href: 'https://tracker.yandex.ru/pages/projects/' + data,
            text: data
        })
        return anchor
    }

    private logProcessor(data: any, ...args: string[]) {
        // console.log(data)
        return data
    }

    private dateProcessor(data: string, ...args: string[]) {
        try {
            const dateTime = new Date(data)
            return dateTime.toLocaleDateString()

        } catch { }
        return data
    }

    private timeProcessor(data: string, ...args: string[]) {
        try {
            const dateTime = new Date(data)
            return dateTime.toLocaleTimeString()
        } catch { }
        return data
    }
}