import ArticleForm from "@/components/template/p-admin/articles/articleForm"

export default function page() {
    return (
        <>
            <h4 className="mb-4 font-bold text-fg">Create New Article</h4>
            <div className="transparentCard">
                <ArticleForm />
            </div>
        </>
    )
}
