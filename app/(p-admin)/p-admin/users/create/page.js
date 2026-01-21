import React from 'react'
import connectToDB from '@/configs/db'
export default async function page() {
    await connectToDB()
    return (
        <>
            <h4 className='fw-bold text-white mb-3'>
                Create New User
            </h4>
            <div className="transparentCard">
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Role</label>
                        <input type="text" className="form-control" required />
                    </div>

                    <div className="col-12 d-flex gap-2 mt-5 justify-content-end">
                        <button className="edit">Create</button>
                        <button type="reset" className="remove">Reset</button>
                    </div>
                </form>
            </div>


        </>

    )
}
