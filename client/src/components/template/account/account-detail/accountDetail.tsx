"use client"
import { useRef } from 'react'
import { useProfile } from '@/hooks/useProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { accountDetailSchema, type AccountDetailInput } from '@/validators/user';

export default function AccountDetail() {
    const { data: user } = useProfile();
    const userId = user?._id;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountDetailInput>({
        resolver: zodResolver(accountDetailSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
            avatar: null,
        }
    })

    const onSubmit = (values: AccountDetailInput) => {
        const data = new FormData();
        Object.entries(values).forEach(([key, val]) => {
            if (val !== null && val !== undefined && val !== "") {
                data.append(key, String(val));
            }
        });
        const file = fileInputRef.current?.files?.[0]
        if (file) data.append("avatar", file);

        // TODO: update-account request (removed for now): PUT /users/:userId with data. On success: toast + router.refresh()
        void userId
    };

    return (
        <>
            <form
                className="admin-card grid max-w-3xl grid-cols-12 gap-4 !border-dashed p-6 sm:p-8"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                {/* Name & Email */}
                <div className="col-span-12 md:col-span-12">
                    <label htmlFor="accountDetail-name" className="field-label">Name</label>
                    <input id="accountDetail-name"
                        type="text"
                        className="field"
                        {...formRegister("name")}
                        required
                    />
                </div>
                <div className="col-span-12 md:col-span-12">
                    <label htmlFor="accountDetail-email" className="field-label">Email</label>
                    <input id="accountDetail-email"
                        type="email"
                        className="field"
                        {...formRegister("email")}
                        required
                    />
                </div>
                <div className="col-span-12 md:col-span-12">
                    <label htmlFor="accountDetail-phone" className="field-label">Phone</label>
                    <input id="accountDetail-phone"
                        type="text"
                        className="field"
                        {...formRegister("phone")}
                        required
                    />
                </div>

                {/* Avatar */}
                <div className="col-span-12 md:col-span-12">
                    <label htmlFor="accountDetail-avatar" className="field-label">Profile Picture</label>
                    <input id="accountDetail-avatar"
                        type="file"
                        name="avatar"
                        accept="image/*"
                        className="field"
                        ref={fileInputRef}
                    />
                </div>

                <div className="col-span-12 mt-4 flex justify-end gap-2">
                    <button type="reset" className="h-10 cursor-pointer rounded-full border border-solid border-line bg-transparent px-6 text-sm font-medium text-fg hover:bg-soft">Reset</button>
                    <button type="submit" className="classic !h-10 !px-8">Save changes</button>
                </div>
            </form>
        </>
    );

}
