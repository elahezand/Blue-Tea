
export interface PageSeo {
    title?: string
    description?: string
    image?: string
}

/** Content of the About page (edited in the admin, comes from the backend) */
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