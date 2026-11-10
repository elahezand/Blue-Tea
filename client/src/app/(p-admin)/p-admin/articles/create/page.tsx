import React from 'react'
import AddNewArticle from '@/components/template/p-admin/articles/addNewArticle'
export default function page() {
  return (
    <>
      <h4 className="font-bold text-fg mb-4">
        Create New Article
      </h4>
      <div className="transparentCard">
        <AddNewArticle />
      </div>
    </>

  )
}
