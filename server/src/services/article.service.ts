import type { FilterQuery } from "mongoose"
import { Types } from "mongoose"
import { clearCache } from "../middlewares/cache.js"
import { fileUrl } from "../middlewares/upload.js"
import Article, { ARTICLE_STATUSES, type IArticle } from "../models/Article.js"
import type { ArticleBody, UpdateArticleBody } from "../schemas/article.schema.js"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"
import { removeUpload } from "../utils/files.js"
import { paginate } from "../utils/paginate.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { countView } from "./view.service.js"

const FOLDER = "articles"
const LIST_FIELDS = "-content"

const makeSlug = async (title: string, excludeId?: string) => {
    const base = title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "article"

    let slug = base
    for (let i = 2; await Article.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); i++) {
        slug = `${base}-${i}`
    }
    return slug
}

const findOr404 = async (filter: FilterQuery<IArticle>) => {
    const article = await Article.findOne(filter)
    if (!article) throw new AppError("Article not found", 404)
    return article
}

/* ---------- Public ---------- */

export const list = ({ limit, cursor, ...query }: ListQuery) =>
    paginate(Article, {
        limit,
        cursor,
        filters: buildListQuery<IArticle>(query, { base: { status: "publish" }, search: ["title", "shortDescription"] }),
        sort: { date: -1 },
        select: LIST_FIELDS,
    })

export const getById = async (id: string) => {
    const article = await Article.findOne({ _id: id, status: "publish" }).lean()
    if (!article) throw new AppError("Article not found", 404)
    return article
}

export const addView = async (id: string, ip: string) => {
    if (!(await Article.exists({ _id: id, status: "publish" }))) throw new AppError("Article not found", 404)
    await countView(Article, "article", id, ip)
}

export const listRelated = async (id: string, limit = 4) => {
    const article = await Article.findOne({ _id: id, status: "publish" }).select("tags").lean()
    if (!article) throw new AppError("Article not found", 404)

    const tags = article.tags ?? []
    const related = tags.length
        ? await Article.aggregate<IArticle & { _id: Types.ObjectId }>([
            { $match: { status: "publish", _id: { $ne: article._id }, tags: { $in: tags } } },
            { $addFields: { shared: { $size: { $setIntersection: ["$tags", tags] } } } },
            { $sort: { shared: -1, date: -1 } },
            { $limit: limit },
            { $project: { content: 0, shared: 0 } },
        ])
        : []

    if (related.length >= limit) return related

    const latest = await Article.find({ status: "publish", _id: { $nin: [article._id, ...related.map((a) => a._id)] } })
        .sort({ date: -1 })
        .limit(limit - related.length)
        .select(LIST_FIELDS)
        .lean()

    return [...related, ...latest]
}
/* ---------- Admin ---------- */
const ADMIN_SORTS: Record<string, Record<string, 1 | -1>> = {
    latest: { date: -1 },
    oldest: { date: 1 },
    views: { views: -1 },
}

export const listAdmin = ({ limit, cursor, sort, ...query }: AdminListQuery) =>
    paginate(Article, {
        limit,
        cursor,
        filters: buildListQuery<IArticle>(query, {
            search: ["title", "author"],
            statuses: ARTICLE_STATUSES,
            dateField: "date",
        }),
        sort: ADMIN_SORTS[sort ?? "latest"] ?? ADMIN_SORTS.latest,
        select: LIST_FIELDS,
    })
export const getAdminById = async (id: string) => {
    const article = await Article.findById(id).lean()
    if (!article) throw new AppError("Article not found", 404)
    return article
}

export const create = async (body: ArticleBody, file?: Express.Multer.File) => {
    const cover = fileUrl(FOLDER, file)
    try {
        const article = await Article.create({ ...body, slug: await makeSlug(body.title), cover })
        await clearCache("articles")
        return article
    } catch (error) {
        await removeUpload(cover)
        throw error
    }
}

export const update = async (id: string, body: UpdateArticleBody, file?: Express.Multer.File) => {
    const newCover = fileUrl(FOLDER, file)
    try {
        const article = await findOr404({ _id: id })
        const oldCover = article.cover
        const titleChanged = body.title !== undefined && body.title !== article.title

        article.set(body)
        if (titleChanged) article.slug = await makeSlug(article.title, id)
        if (newCover) article.cover = newCover

        await article.save()
        if (newCover) await removeUpload(oldCover)
        await clearCache("articles")
        return article
    } catch (error) {
        await removeUpload(newCover)
        throw error
    }
}

export const remove = async (id: string) => {
    const article = await findOr404({ _id: id })
    await article.deleteOne()
    await removeUpload(article.cover)
    await clearCache("articles")
}