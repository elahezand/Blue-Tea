
export interface PageSeo {
    title?: string
    description?: string
    image?: string
}

export interface AboutContent {
    title: string
    intro?: string
    story: {
        heading: string
        paragraphs: string[]
        image?: string
    }
    values: {
        title: string
        text: string
    }[]
    seo?: PageSeo
}