import React from 'react'
import { getMe } from '@/utils/auth';
import AdminProfileClient from '@/components/template/p-admin/detail-account/AdminProfileClient';

export default async function page() {
    const Info = await getMe()

    return (
        <>
            <h4 className='fw-bold text-white mb-3'>
                Detail Account
            </h4>
            <div className="transparentCard">
                <AdminProfileClient adminData={JSON.parse(JSON.stringify(Info))} />
            </div>
        </>
    )
}

