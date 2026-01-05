"use client"
import React from 'react'
import { usePost } from '@/utils/hooks/useReactQueryPanel'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import swal from 'sweetalert'
export default function ContactsList({ data }) {
    const router = useRouter()

    const { mutate: banmutate } = usePost("/users/ban", {
        onSuccess: () => {
            toast.success("this user Banned Successfully :)")
            router.refresh()

        },
        onError: () => toast.error("Error"),
    })
    const banUser = async (name, email) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                banmutate({ username: name, email })
            }
        })
    }

    const showContent = async (content) => {
        swal({
            title: content,
            buttons: "ok"
        })
    }


    return (
        <tbody>
            {data.map((c, index) => (
                <tr key={index + 1}>
                    <td className="number">
                        <span>{index + 1}</span></td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td> {c.phone}</td>
                    <td> {c.company}</td>
                    <td>{c.createdAt?.slice(0, 10)}</td>
                    <td>
                        <button
                            onClick={() => showContent(c.body)}
                           className="classic">
                            Content
                        </button>
                    </td>
                    <td className="d-flex gap-1">
                        <button
                            onClick={() => banUser(c.name, c.email)}
                            className='remove'>
                            Ban
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
