import React from 'react'
export default function page() {
    return (
        <>
            <h4 className="font-bold text-fg mb-4">
                Create New User
            </h4>
            <div className="transparentCard">
                <form className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        <label className="field-label">Name</label>
                        <input type="text" className="field" required />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <label className="field-label">Email</label>
                        <input type="email" className="field" required />
                    </div>

                    <div className="col-span-6">
                        <label className="field-label">Phone</label>
                        <input type="text" className="field" required />
                    </div>

                    <div className="col-span-6">
                        <label className="field-label">Role</label>
                        <input type="text" className="field" required />
                    </div>

                    <div className="flex gap-2 mt-12 justify-end col-span-12">
                        <button className="edit">Create</button>
                        <button type="reset" className="remove">Reset</button>
                    </div>
                </form>
            </div>


        </>

    )
}
