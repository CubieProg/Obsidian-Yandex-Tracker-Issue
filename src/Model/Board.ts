import { Column } from './UtilTypes/Column'
import { IYaTrDTO } from './UtilTypes/IYaTrDTO'

export class Board implements IYaTrDTO {

    public readonly DTOName: string = "Board"
    public readonly DTOType: any = Board

    public self: string
    public id: string
    public version: string
    public name: string
    public filter: string
    public orderBy: string
    public orderAsc: string
    public query: string
    public useRanking: string
    public estimateBy: string
    public country: string
    public defaultQueue: string
    public calendar: string

    public columns: Column[]

    public readonly mainField: string = "name"


    public static complexFiedls: Object = {
    }

    public static aliases: Object = {
        "self": "Адрес ресурса",
        "id": "Hash-ID доски",
        "version": "Версия",
        "name": "Название доски",
        "filter": "Фильтр",
        "orderBy": "Сортировка",
        "orderAsc": "Направление сортировки",
        "query": "Запрос",
        "useRanking": "Возможность менять порядок",
        "estimateBy": "Оценивание",
        "country": "Страна",
        "defaultQueue": "Очередь по умолчанию",
        "calendar": "Календарь",

        "columns": "Колонки",
    }
}