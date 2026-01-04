import connectToDB from "@/db/db"
import AddNewArticle from "@/components/template/p-admin/articles/addNewArticle"
import ArticleModel from "@/model/article"
export default async function page({ searchParams }) {
    await connectToDB()
    const { id } = await searchParams
    
    const article = await ArticleModel.findOne({ _id: id })
    const safeArticles = JSON.parse(JSON.stringify(article))

    return (
        <>
            <h4 className='fw-bold'
                style={{
                    color: "var(--brown-light)",
                    marginBottom: "1rem"
                }}>
                Article Draft
            </h4>
            <div className="transparentCard">
                <AddNewArticle
                    article={safeArticles} />
            </div>
        </>
    )
}
