"use client"
import React, { useCallback, useEffect } from 'react'
import Table from '@/components/modules/table/Table';
import { useGet } from '@/utils/hooks/useReactQueryPanel';
import Pagination from '@/components/modules/pagination/pagination';
import { useContext } from 'react';
import { UserContext } from '@/utils/context/userProvider';
import swal from 'sweetalert';


export default function CommentsClient() {
    const { user } = useContext(UserContext);
    const userId = user?.id || user?._id;

    const { data, isLoading } = useGet(
        `/comments/${userId}`,
        {},
        { enabled: !!userId }
    );

    const showContent = useCallback((content) => {
        swal({
            title: "Content",
            text: content,
            icon: "info",
            button: "Close"
        });
    }, [])

    const showAnswer = useCallback((answer) => {
        swal({
            title: "Content",
            text: answer,
            icon: "info",
            button: "Close"
        });
    }, [])

    if (isLoading) return <span className='fw-bold text-white fs-3'>Loading .....</span>

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Score</th>
                        <th>CreatedAT</th>
                        <th>Content</th>
                        <th>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data?.length > 0 ? (
                        data.data.map((c, index) => (
                            <tr key={c._id || index}>
                                <td className="number">
                                    <span>{index + 1}</span></td>
                                <td>{c.username}</td>
                                <td>{c.score}</td>
                                <td>{c.date ? c.date.slice(0, 10) : "---"}</td>
                                <td>
                                    <button
                                        onClick={() => showContent?.(c.body)}
                                        className="classic"
                                    >
                                        Content
                                    </button>
                                </td>
                                <td>
                                    {c.answer.length > 0 ? (
                                        <button
                                            onClick={() => showAnswer?.(c.answer)}
                                            className="classic">
                                            Answered
                                        </button>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-white py-4">
                                No comments found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination
                href={`comments?`}
                currentPage={data?.page}
                pageCount={data?.pageCount}
                limit={data?.limit} />
        </>

    )
}
