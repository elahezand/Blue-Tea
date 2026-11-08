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