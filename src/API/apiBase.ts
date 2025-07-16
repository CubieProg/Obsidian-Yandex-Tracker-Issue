import { requestUrl, RequestUrlResponsePromise } from "obsidian"
import { StatusCode, status_codes } from "./StatusCodes";
import { delay } from "../utils";

// Шлёт одиночные запросы с отказоучтойчивостью и (ХА-ХА) кэшем

export type FailResponse = {
    statusCode: StatusCode
}

export type RequestMethods = "GET" | "POST"

export const isFailResponse = (x: FailResponse | any): x is FailResponse => (x as FailResponse).statusCode !== undefined;

export class API {
    private retries: number = 10;
    private delayMultiplier: number = 150;

    private cache: Map<Record<string, string>, any> = new Map(); // Всрато, всрато... Очень всрато
    private cacheLimit: number = 666 // Цифра взята с потолка (или из под земли?). Мне было лень писать нормальный кэш. Не судите строго

    constructor() { }

    public async request(
        URL: string,
        headers: Record<string, string>,
        method: RequestMethods = "GET",
        data: any = undefined,
        skipRetry: boolean = false,
        retries: number = 0
    ): Promise<RequestUrlResponsePromise | FailResponse> {
        if (this.cache.has({ [method]: URL })) { return this.cache.get({ [method]: URL }) } // Всрато, всрато... Очень всрато

        if (retries > this.retries || (retries >= 1 && skipRetry)) {
            return { statusCode: status_codes[0] } as FailResponse
        }

        const response = await requestUrl({
            url: URL,
            method: method,
            headers: headers,
            body: data
        }).catch(
            async (err) => {
                console.error(`GET Request Fail. URL: ${URL}`, err)
                await delay((retries + 1) * this.delayMultiplier)
                return await this.request(URL, headers, method, data, skipRetry, retries + 1)
            }
        )

        this.cache.set({ [method]: URL }, response) // Всрато, всрато... Очень всрато
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
                return await this.post(URL, headers, body, skipRetry, retries + 1)
            }
        )

        return response
    }
}