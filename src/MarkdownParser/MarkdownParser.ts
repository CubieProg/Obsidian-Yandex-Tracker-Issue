import { Plugin } from 'obsidian';

export class MarkdownParser {

    constructor() {

    }

    public registerProcessors(plugin: Plugin) {

    }

    private async boardProcessor(source, el, ctx) {
        
    }

    private async issueProcessor(source, el, ctx) {

    }

    private async queueProcessor(source, el, ctx) {

    }

    private async userProcessor(source, el, ctx) {

    }

    private async testProcessor(source, el, ctx) {

    }
}



// public async requestBoard(boardId: string) {
//     const response = await this.requestWrapper("boards", boardId)
//     console.log(response)
// }

// public async requestIssue(issueId: string) {
//     const response = await this.requestWrapper("issues", issueId)
//     console.log(response)
// }

// public async requestQueue(queueId: string) {
//     const response = await this.requestWrapper("queues", queueId)
//     console.log(response)
// }

// public async requestUser(userId: string) {
//     const response = await this.requestWrapper("users", userId)
//     console.log(response)
// }

// public async requestMe() {
//     const response = await this.requestWrapper("myself")
//     console.log(response)
// }