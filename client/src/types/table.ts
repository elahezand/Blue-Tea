export type FilterOption = string | { value: string; label: string }

export type FilterField =
    | { type: "search"; name: string; placeholder?: string }
    | { type: "select"; name: string; label: string; options: FilterOption[] }
    | { type: "date"; name: string; label: string; keys?: [string, string] }
    | { type: "range"; name: string; label: string; prefix?: string; keys?: [string, string] }
