"use client"
import React from 'react'
import swal from 'sweetalert'
import { usePost, usePut } from '@/utils/hooks/useReactQueryPanel'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CommentsList({ data }) {
    const router = useRouter()
    const { mutate: answerMutate } = usePost("/comments/answer", {
        onSuccess: () => {
            toast.success("your answer sended Successfully :)")
            router.refresh()

        },
        onError: () => toast.error("Error"),
    })

    const { mutate: acceptMutate } = usePut("/comments", {
        onSuccess: () => {
            toast.success("Successfull :)")
            router.refresh()
        },
        onError: () => toast.error("Error"),
    })

    const { mutate: banmutate } = usePost("/users/ban", {
        onSuccess: () => {
            toast.success("this user Banned Successfully :)")
            router.refresh()

        },
        onError: () => toast.error("Error"),
    })

    const showContent = async (content) => {
        swal({
            title: content,
            buttons: "ok"
        })
    }

    const answerComment = async (e, Id) => {
        e.preventDefault()
        swal({
            title: "Please Send Your Answer",
            content: "input",
            buttons: "submit"
        }).then(result => {
            if (result) {
                answerMutate({
                    answer: result,
                    commentID: Id
                })
            }
        })
    }

    const acceptComment = (commentID) => {
        acceptMutate({ id: `${commentID}/accept` })
    }

    const banUser = async (email, username) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                banmutate({ email, username })
            }
        })
    }

    return (
        <tbody>
            {data.map((c, index) => (
                <tr key={index + 1}>
                    <td className="number">
                        <span>{index + 1}</span></td>
                    <td>{c.username}</td>
                    <td>{c.email}</td>
                    <td> {c.score}</td>
                    <td>{c.date?.slice(0, 10)}</td>
                    <td>{c.productID?.name}</td>
                    <td>
                        <button
                            onClick={() =>
                                showContent(c.body)}
                           className="classic">
                            Content
                        </button>
                    </td>
                    <td className="d-flex gap-1">
                        {!c.answer && <button
                            onClick={(e) =>
                                answerComment(e, c._id)}
                            className='edit'>
                            Answer
                        </button>}
                        <button
                            onClick={() => banUser(c.email, c.username)}
                            className='remove'>
                            Ban
                        </button>
                        {c.isAccept ?
                            <button
                                onClick={() =>
                                    acceptComment(c._id)}
                                className='remove'>
                                Reject
                            </button> :
                            <button
                                onClick={() =>
                                    acceptComment(c._id)}
                                className='edit'>
                                Accept
                            </button>
                        }
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
