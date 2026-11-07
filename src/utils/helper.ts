export const isValidObjectId = (id: unknown): boolean => /^[a-f\d]{24}$/i.test(String(id || ""));

export const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export const categoryName = (category: unknown): string | undefined =>
  category && typeof category === "object" && "name" in category ? String((category as { name: unknown }).name) : undefined;

export const firstImage = (img: string | string[] | undefined | null): string =>
  (Array.isArray(img) ? img[0] : img) || "";
