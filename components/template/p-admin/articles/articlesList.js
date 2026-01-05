"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useDelete } from '@/utils/hooks/useReactQueryPanel'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import swal from 'sweetalert'

export default function ArticlesList({ data }) {
    const router = useRouter()

    const { mutate } = useDelete(`/articles`, {
        onSuccess: (data) => {
            router.refresh()
        },
        onError: (err) => {
            toast.error("Error creating order");
        },
    })

    const removeArticle = (id) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                mutate(id)
            }
        })
    }

    return (
        <tbody>
            {data.map((a, index) => (
                <tr key={index + 1}>
                    <td className="number">
                        <span>{index + 1}</span></td>
                    <td>
                        <Image
                            width={50}
                            height={50}
                            src={a.cover}
                            alt=''
                            className='mx-1' />
                        {a.title}
                    </td>
                    <td> {a.author}</td>
                    <td>{a.shortDescription}</td>
                    <td>{a.status}</td>
                    <td className="d-flex gap-1">
                        <button
                            onClick={() => removeArticle(a._id)}
                            className='remove'>
                            Remove
                        </button>
                        {a.status === "publish" ?
                            <Link
                                href={`/p-admin/articles/${a._id}`}
                                className='edit'>
                                Edit
                            </Link> :
                            <Link
                                href={`/p-admin/articles/draft?id=${a._id}`}
                                className="classic">
                                Draft
                            </Link>}
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
