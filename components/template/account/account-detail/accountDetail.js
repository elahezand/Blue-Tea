"use client"
import React from 'react'
import { useContext } from 'react';
import { UserContext } from '@/utils/context/userProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { usePut } from '@/utils/hooks/useReactQueryPanel';
import { useForm } from 'react-hook-form';
import { userValidationSchema } from '@/validators/user';
import toast from 'react-hot-toast';

export default function AccountDetail() {
    const { user } = useContext(UserContext);
    const userId = user?.id || user?._id;

    const router = useRouter()
    const fileInputRef = React.useRef(null);

    const { mutate: userMutate } = usePut("/users", {
        onSuccess: () => {
            toast.success("your Info updated Successfully :)")
            router.refresh()
        },
    })

    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userValidationSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: null,
            password: "",
            newPassword: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (values) => {
        const data = new FormData();
        Object.entries(values).forEach(([key, val]) => {
            if (val !== null && val !== "") {
                data.append(key, val);
            }
            if (fileInputRef.current?.files?.[0]) {
                data.append("avatar", fileInputRef.current.files[0]);
            }
        });

        userMutate({ id: userId, payload: data })
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
                        name="name"
                        className="field"
                        {...formRegister("name")}
                        required
                    />
                </div>
                <div className="col-span-12 md:col-span-12">
                    <label htmlFor="accountDetail-email" className="field-label">Email</label>
                    <input id="accountDetail-email"
                        type="email"
                        name="email"
                        className="field"
                        {...formRegister("email")}
                        required
                    />
                </div>
                <div className="col-span-12 md:col-span-12">
                    <label htmlFor="accountDetail-phone" className="field-label">Phone</label>
                    <input id="accountDetail-phone"
                        type="text"
                        name="phone"
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

                {/* Change Password */}
                <div className="col-span-12 md:col-span-4">
                    <label htmlFor="accountDetail-password" className="field-label">Old Password</label>
                    <input id="accountDetail-password"
                        type="password"
                        name="password"
                        className="field"
                        {...formRegister("password")}

                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <label htmlFor="accountDetail-newPassword" className="field-label">New Password</label>
                    <input id="accountDetail-newPassword"
                        type="password"
                        name="newPassword"
                        className="field"
                        {...formRegister("newPassword")}

                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <label htmlFor="accountDetail-confirmPassword" className="field-label">Confirm New Password</label>
                    <input id="accountDetail-confirmPassword"
                        type="password"
                        name="confirmPassword"
                        className="field"
                        {...formRegister("confirmPassword")}
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
