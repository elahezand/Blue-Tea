import { Types, type FilterQuery } from "mongoose"
import type { AdminListQuery } from "../schemas/common.schema.js"

type ListParams = Partial<AdminListQuery> & Record<string, unknown>

interface ListQueryOptions<T> {
    base?: FilterQuery<T>
    search?: string[]
    statuses?: readonly string[]
    ids?: Record<string, string>
    dateField?: string
    extra?: FilterQuery<T>
}

const PRESET_DAYS: Record<string, number> = { today: 0, "7d": 6, "30d": 29, "90d": 89 }

export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const startOfDay = (value: string) => {
    const date = new Date(`${value}T00:00:00.000Z`)
    return Number.isNaN(date.getTime()) ? null : date
}

export const endOfDay = (value: string) => {
    const date = new Date(`${value}T23:59:59.999Z`)
    return Number.isNaN(date.getTime()) ? null : date
}

export const dateRangeFilter = (query: ListParams, field = "createdAt") => {
    const preset = typeof query.preset === "string" ? PRESET_DAYS[query.preset] : undefined
    if (preset !== undefined) {
        const from = new Date()
        from.setUTCDate(from.getUTCDate() - preset)
        from.setUTCHours(0, 0, 0, 0)
        return { [field]: { $gte: from } }
    }

    const range: Record<string, Date> = {}
    const from = query.from ? startOfDay(query.from) : null
    const to = query.to ? endOfDay(query.to) : null
    if (from) range.$gte = from
    if (to) range.$lte = to

    return Object.keys(range).length ? { [field]: range } : {}
}

export const searchFilter = (query: ListParams, fields: string[] = []) => {
    const term = String(query.q ?? "").trim().slice(0, 100)
    if (!term || !fields.length) return {}

    const regex = new RegExp(escapeRegex(term), "i")
    return fields.length === 1 ? { [fields[0]]: regex } : { $or: fields.map((field) => ({ [field]: regex })) }
}

export const statusFilter = (query: ListParams, allowed: readonly string[] = []) => {
    const value = query.status
    if (!value || value === "all") return {}
    return allowed.length && !allowed.includes(value) ? {} : { status: value }
}

export const notificationStatusFilter = (status: string | undefined, userId: Types.ObjectId) => {
    if (status === "unread") return { readBy: { $ne: userId } }
    if (status === "read") return { readBy: userId }
    return {}
}
export const idFilter = (query: ListParams, param: string, field = param) => {
    const value = query[param]
    return typeof value === "string" && Types.ObjectId.isValid(value) ? { [field]: new Types.ObjectId(value) } : {}
}

export const buildListQuery = <T>(query: ListParams = {}, options: ListQueryOptions<T> = {}): FilterQuery<T> => {
    const { base, search = [], statuses = [], ids = {}, dateField, extra } = options

    const idFilters = Object.entries(ids).map(([param, field]) => idFilter(query, param, field))

    const parts = [
        base,
        dateRangeFilter(query, dateField),
        statusFilter(query, statuses),
        searchFilter(query, search),
        ...idFilters,
        extra,
    ].filter((part): part is FilterQuery<T> => !!part && Object.keys(part).length > 0)

    if (!parts.length) return {}
    return parts.length === 1 ? parts[0] : ({ $and: parts } as FilterQuery<T>)
}
