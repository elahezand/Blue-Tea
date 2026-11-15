import { Schema, model } from "mongoose"

export interface IAbout {
    title: string
    intro?: string
    story: { heading: string; paragraphs: string[]; image?: string }
    values: { title: string; text: string }[]
    seo?: { title?: string; description?: string; image?: string }
    createdAt: Date
    updatedAt: Date
}

const aboutSchema = new Schema<IAbout>({
    title: { type: String, required: true },
    intro: String,
    story: {
        heading: { type: String, required: true },
        paragraphs: [String],
        image: String,
    },
    values: [{ _id: false, title: { type: String, required: true }, text: { type: String, required: true } }],
    seo: { title: String, description: String, image: String },
}, { timestamps: true })

const About = model<IAbout>("About", aboutSchema)

export default About
