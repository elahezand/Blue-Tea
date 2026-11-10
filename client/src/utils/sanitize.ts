import sanitizeHtml from "sanitize-html"


export const sanitizeContent = (html: string): string =>
    sanitizeHtml(html, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "figure", "figcaption"],
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "width", "height", "loading"],
            a: ["href", "title", "target", "rel"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
            }),
        },
    })