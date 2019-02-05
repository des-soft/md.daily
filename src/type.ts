export type ArticleMeta = {
    [key: string]: string | number | Date | any[]
}

export type Article = {
    meta: ArticleMeta
    content: string;
    origin: string;
}
