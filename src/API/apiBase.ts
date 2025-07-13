import { requestUrl, RequestUrlResponsePromise } from "obsidian"
import { StatusCode, status_codes } from "./StatusCodes";
import { delay } from "../utils";

// Шлёт одиночные запросы с отказоучтойчивостью

export type FailResponse = {
    statusCode: StatusCode
}


export const isFailResponse = (x: FailResponse | any): x is FailResponse => (x as FailResponse).statusCode !== undefined;

export class API {
    private retries: number = 10;
    private delayMultiplier: number = 150;

    constructor() { }

    public async request(
        URL: string,
        headers: Record<string, string>,
        skipRetry: boolean = false,
        retries: number = 0
    ): Promise<RequestUrlResponsePromise | FailResponse> {
        if (retries > this.retries || (retries >= 1 && skipRetry)) {
            return { statusCode: status_codes[0] } as FailResponse
        }

        const response = await requestUrl({
            url: URL,
            method: "GET",
            headers: headers
        }).catch(
            async (err) => {
                console.error(err)
                await delay((retries + 1) * this.delayMultiplier)
                return await this.request(URL, headers, skipRetry, retries + 1)
            }
        )

        return response
    }
}