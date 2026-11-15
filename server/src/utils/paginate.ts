import { Types, type FilterQuery, type Model, type PopulateOptions } from "mongoose"
import { AppError } from "./AppError.js"
import type { CursorPagination } from "./response.js"

type SortOrder = 1 | -1
type CursorValue = string | number | boolean | Date | Types.ObjectId | null

interface PaginateOptions<T> {
    limit?: unknown
    cursor?: unknown
    filters?: FilterQuery<T>
    sort?: Record<string, SortOrder>
    populate?: string | PopulateOptions | (string | PopulateOptions)[] | null
    select?: string | null
}

export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 100

const getPath = (doc: Record<string, unknown>, path: string): unknown =>
    path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown> | undefined)?.[key], doc)

const encodeCursor = (value: unknown, id: unknown) => {
    const type = value instanceof Date ? "date" : value instanceof Types.ObjectId ? "id" : "raw"
    const raw = value instanceof Date ? value.toISOString() : value instanceof Types.ObjectId ? value.toString() : value ?? null
    return Buffer.from(JSON.stringify({ t: type, v: raw, id: String(id) })).toString("base64url")
}

const decodeCursor = (cursor: string): { value: CursorValue; id: Types.ObjectId } => {
    try {
        const { t, v, id } = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"))
        if (!Types.ObjectId.isValid(id)) throw new Error()
        const value = t === "date" ? new Date(v) : t === "id" ? new Types.ObjectId(v) : v
        return { value, id: new Types.ObjectId(id) }
    } catch {
        throw new AppError("Invalid cursor", 400)
    }
}

export const paginate = async <T>(
    model: Model<T>,
    { limit, cursor = null, filters = {}, sort = { createdAt: -1 }, populate = null, select = null }: PaginateOptions<T> = {},
) => {
    const size = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT)
    const [sortKey, sortOrder] = Object.entries(sort)[0] ?? ["_id", -1]
    const op = sortOrder === 1 ? "$gt" : "$lt"
    const fullSort: Record<string, SortOrder> = sortKey === "_id" ? { _id: sortOrder } : { [sortKey]: sortOrder, _id: sortOrder }

    const query: FilterQuery<T> = { ...filters }

    if (typeof cursor === "string" && cursor) {
        const { value, id } = decodeCursor(cursor)
        const condition = sortKey === "_id"
            ? { _id: { [op]: id } }
            : { $or: [{ [sortKey]: { [op]: value } }, { [sortKey]: value, _id: { [op]: id } }] }
        query.$and = [...(query.$and ?? []), condition] as FilterQuery<T>["$and"]
    }

    let dbQuery = model.find(query).sort(fullSort).limit(size + 1)
    if (populate) dbQuery = dbQuery.populate(populate as string)
    if (select) dbQuery = dbQuery.select(select)

    const rows = (await dbQuery.lean()) as unknown as (T & { _id: Types.ObjectId })[]
    const hasMore = rows.length > size
    const data = hasMore ? rows.slice(0, size) : rows
    const last = data[data.length - 1] as Record<string, unknown> | undefined

    const pagination: CursorPagination = {
        limit: size,
        nextCursor: hasMore && last ? encodeCursor(getPath(last, sortKey), last._id) : null,
        hasMore,
    }

    return { data, pagination }
}