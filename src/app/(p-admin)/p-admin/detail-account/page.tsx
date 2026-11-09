import React from 'react'
import { getMe } from '@/services/auth.service';
import AdminProfileClient from '@/components/template/p-admin/detail-account/AdminProfileClient';

export default async function page() {
    const Info = await getMe()

    return (
        <>
            <h4 className="font-bold text-fg mb-4">
                Detail Account
            </h4>
            <div className="transparentCard">
                <AdminProfileClient adminData={Info} />
            </div>
        </>
    )
}

