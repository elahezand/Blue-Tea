export const isValidObjectId = (id: unknown): boolean => /^[a-f\d]{24}$/i.test(String(id || ""));

export const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export const categoryName = (category: unknown): string | undefined =>
  category && typeof category === "object" && "name" in category ? String((category as { name: unknown }).name) : undefined;

export const firstImage = (img: string | string[] | undefined | null): string =>
  (Array.isArray(img) ? img[0] : img) || "";

export const toQueryString = (params: Record<string, unknown> = {}): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    (Array.isArray(value) ? value : [value]).forEach((v) => search.append(key, String(v)));
  });
  const text = search.toString();
  return text ? `?${text}` : "";
};

export const formatDate = (value?: string): string | undefined => {
    if (!value) return undefined
    const date = new Date(value)
    return Number.isNaN(date.getTime())
        ? undefined
        : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export const formatGrams = (grams: number): string =>
    grams >= 1000 && grams % 1000 === 0 ? `${grams / 1000} kg` : `${grams} g`

export const formatPrice = (value: number): string => `$${Math.round(value * 100) / 100}`


export const unwrap = <T>(body: T | { data: T }): T =>
    body && typeof body === "object" && !Array.isArray(body) && "data" in body
        ? (body as { data: T }).data
        : (body as T)


// ---------- weights (tea is sold by the gram) ----------

/** product.price is the price of this many grams. Change it if your prices are per kg etc. */
export const BASE_GRAMS = 100

/** Weights offered when the product has no variants */
export const DEFAULT_GRAMS = [50, 100, 250, 500, 1000]

/** "100g, 250g, 0.5kg" (or an array of those) -> [100, 250, 500]. Anything unreadable is skipped. */
export const parseVariants = (v: string | string[] | null | undefined): number[] => {
    const list = Array.isArray(v) ? v : String(v || "").split(/[,;\n]/)
    const out = list.map((x) => {
        const m = String(x).trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(kg|g|gr|gram|grams)?$/)
        if (!m) return null
        const n = parseFloat(m[1])
        return Math.round(m[2] === "kg" ? n * 1000 : n)
    }).filter((n): n is number => n !== null && n > 0 && n <= 20000)
    return [...new Set(out)].sort((a, b) => a - b)
}

/** The weights a product can be bought in */
export const gramsOptions = (variants?: string | string[] | null): number[] => {
    const parsed = parseVariants(variants)
    return parsed.length ? parsed : DEFAULT_GRAMS
}

/** The weight chosen at first: 250 g or the next bigger one, else the biggest */
export const defaultGrams = (variants?: string | string[] | null): number => {
    const options = gramsOptions(variants)
    return options.find((g) => g >= 250) || options[options.length - 1]
}

/** Price of one pack of this weight (only for showing: the backend works out the real price) */
export const packPrice = (price: number, grams: number): number => Math.round((price * grams) / BASE_GRAMS * 100) / 100
