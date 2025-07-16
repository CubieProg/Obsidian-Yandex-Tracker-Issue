import { requestUrl, RequestUrlResponsePromise } from "obsidian"
import { StatusCode, status_codes } from "./StatusCodes";
import { delay } from "../utils";

// Шлёт одиночные запросы с отказоучтойчивостью и (ХА-ХА) кэшем

export type FailResponse = {
    statusCode: StatusCode
}

export const isFailResponse = (x: FailResponse | any): x is FailResponse => (x as FailResponse).statusCode !== undefined;

export class API {
    private retries: number = 10;
    private delayMultiplier: number = 150;

    private cache: Map<string, any> = new Map(); // Всрато, всрато... Очень всрато
    private cacheLimit: number = 666 // Цифра взята с потолка (или из под земли?). Мне было лень писать нормальный кэш. Не судите строго

    constructor() { }

    public async request(
        URL: string,
        headers: Record<string, string>,
        skipRetry: boolean = false,
        retries: number = 0
    ): Promise<RequestUrlResponsePromise | FailResponse> {
        if (this.cache.has(URL)) { return this.cache.get(URL) } // Всрато, всрато... Очень всрато

        if (retries > this.retries || (retries >= 1 && skipRetry)) {
            return { statusCode: status_codes[0] } as FailResponse
        }

        const response = await requestUrl({
            url: URL,
            method: "GET",
            headers: headers
        }).catch(
            async (err) => {
                console.error(`GET Request Fail. URL: ${URL}`, err)
                await delay((retries + 1) * this.delayMultiplier)
                return await this.request(URL, headers, skipRetry, retries + 1)
            }
        )

        this.cache.set(URL, response) // Всрато, всрато... Очень всрато
        if (this.cache.size > this.cacheLimit) { this.cache.clear() } // Всрато, всрато... Очень всрато
        return response
    }

    public async post(
        URL: string,
        headers: Record<string, string>,
        body: any,
        skipRetry: boolean = false,
        retries: number = 0
    ): Promise<RequestUrlResponsePromise | FailResponse> {
        if (retries > this.retries || (retries >= 1 && skipRetry)) {
            return { statusCode: status_codes[0] } as FailResponse
        }

        const response = await requestUrl({
            url: URL,
            method: "POST",
            headers: headers,
            body: body
        }).catch(
            async (err) => {
                console.error(`POST Request Fail. URL: ${URL}`, err)
                await delay((retries + 1) * this.delayMultiplier)
                return await this.request(URL, headers, skipRetry, retries + 1)
            }
        )

        return response
    }
}