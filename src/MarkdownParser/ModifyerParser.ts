import { DisplayAttribute } from "../Settings/Settings"


export class ModifyerParser {
    public process(data: any, displayAttribute: DisplayAttribute) {
        displayAttribute.modifyers.forEach(value => {
            const modifyer = this.findModifyer(value)

            if (modifyer) {
                data = this.modifyers[modifyer].processor(data, value)
            }
        })

        return data
    }


    private findModifyer(modifyer: string): string | undefined {
        for (let key in this.modifyers) {
            if (this.modifyers[key].check(key, modifyer)) { return key }
        }
    }

    private readonly modifyers: object = {
        "initials": {
            processor: this.initialsProcessor,
            check: this.equalCheck
        },
        "trim": {
            processor: this.trimProcessor,
            check: this.startsWithCheck
        },
        "yesno": {
            processor: this.yesnoProcessor,
            check: this.equalCheck
        },
        "link": {
            processor: this.linkProcessor,
            check: this.equalCheck
        },
        "ytlink": {
            processor: this.ytlinkProcessor,
            check: this.equalCheck
        },
        "boardlink": {
            processor: this.boardlinkProcessor,
            check: this.equalCheck
        },
        "projectlink": {
            processor: this.projectlinkProcessor,
            check: this.equalCheck
        },
        "log": {
            processor: this.logProcessor,
            check: this.equalCheck
        },
        "date": {
            processor: this.dateProcessor,
            check: this.equalCheck
        },
        "time": {
            processor: this.timeProcessor,
            check: this.equalCheck
        }
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

    private initialsProcessor(data: string, modifyerKey: string = "") {
        const tokens = data.replace(/\s+/g, ' ').split(" ")

        return tokens.reduce((acc: string, curr: string, idx: number, array: string[]) => {
            if (idx >= array.length - 1) {
                return acc + (acc ? " " + curr : curr)
            }
            return acc + curr[0] + '.'
        }, "")
    }

    private trimProcessor(data: string, modifyerKey: string = "") {
        try {
            const trim_word_length = "trim".length
            const word_length = Number(modifyerKey.substring(trim_word_length, modifyerKey.length))

            if (word_length >= data.length) { return data }
            return data.substring(0, word_length) + '...'
        } catch {
            return data
        }
    }

    private yesnoProcessor(data: any, modifyerKey: string = "") {
        if (data) { return "Да" }
        return "Нет"
    }

    private linkProcessor(data: string, modifyerKey: string = "") {
        const anchor: HTMLAnchorElement = createEl('a', { 
            href: data, 
            text: data
        })
        return anchor
    }

    private ytlinkProcessor(data: string, modifyerKey: string = "") {
        const anchor: HTMLAnchorElement = createEl('a', { 
            href: 'https://tracker.yandex.ru/' + data, 
            text: data
        })
        return anchor
    }

    private boardlinkProcessor(data: string, modifyerKey: string = "") {
        const anchor: HTMLAnchorElement = createEl('a', {
            href: 'https://tracker.yandex.ru/agile/board/' + data,
            text: data
        })
        return anchor
    }

    private projectlinkProcessor(data: string, modifyerKey: string = "") {
        const anchor: HTMLAnchorElement = createEl('a', {
            href: 'https://tracker.yandex.ru/pages/projects/' + data,
            text: data
        })
        return anchor
    }

    private logProcessor(data: any, modifyerKey: string = "") {
        // console.log(data)
        return data
    }

    private dateProcessor(data: string, modifyerKey: string = "") {
        try {
            const dateTime = new Date(data)
            return dateTime.toLocaleDateString()

        } catch { }
        return data
    }

    private timeProcessor(data: string, modifyerKey: string = "") {
        try {
            const dateTime = new Date(data)
            return dateTime.toLocaleTimeString()
        } catch { }
        return data
    }
}