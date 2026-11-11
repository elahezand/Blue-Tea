import CreateUserForm from "@/components/template/p-admin/users/createUserForm"

export default function page() {
    return (
        <>
            <h4 className="mb-4 font-bold text-fg">Create New User</h4>
            <div className="transparentCard">
                <CreateUserForm />
            </div>
        </>
    )
}
