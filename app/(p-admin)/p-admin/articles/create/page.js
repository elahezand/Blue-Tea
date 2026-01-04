import React from 'react'
import connectToDB from '@/db/db'
import AddNewArticle from '@/components/template/p-admin/articles/addNewArticle'
export default async function page() {
 await connectToDB()
  return (
    <>
      <h4 className='fw-bold'
        style={{ color: "var(--brown-light)", marginBottom: "1rem" }}>
        Create New Article
      </h4>
      <div className="transparentCard">
        <AddNewArticle />
      </div>
    </>

  )
}
