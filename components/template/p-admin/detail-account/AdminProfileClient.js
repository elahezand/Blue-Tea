"use client";
import React from "react";
import toast from "react-hot-toast";
import { usePut } from "@/utils/hooks/useReactQueryPanel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { userValidationSchema } from "@/validators/user";
export default function AdminProfileClient({ adminData }) {
    const router = useRouter()
    const fileInputRef = React.useRef(null);

    const { mutate: userMutate } = usePut("/users", {
        onSuccess: () => {
            toast.success("user updated Successfully :)")
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
            name: adminData.name,
            email: adminData.email,
            phone: adminData.phone,
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

        userMutate({ id: adminData._id, payload: data })
    };

    return (
        <>

            <h4 className="font-bold"
                style={{ color: "var(--brown-light)", marginBottom: "1rem" }}>
                Detail Account
            </h4>
            <div>
                <form
                    className="panel-form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    {/* Name & Email */}
                    <div className="col-span-12 md:col-span-12">
                        <label htmlFor="AdminProfileClient-name" className="field-label">Name</label>
                        <input id="AdminProfileClient-name"
                            type="text"
                            name="name"
                            className="field"
                            {...formRegister("name")}
                            required
                        />
                    </div>
                    <div className="col-span-12 md:col-span-12">
                        <label htmlFor="AdminProfileClient-email" className="field-label">Email</label>
                        <input id="AdminProfileClient-email"
                            type="email"
                            name="email"
                            className="field"
                            {...formRegister("email")}
                            required
                        />
                    </div>
                    <div className="col-span-12 md:col-span-12">
                        <label htmlFor="AdminProfileClient-phone" className="field-label">Phone</label>
                        <input id="AdminProfileClient-phone"
                            type="text"
                            name="phone"
                            className="field"
                            {...formRegister("phone")}
                            required
                        />
                    </div>

                    {/* Avatar */}
                    <div className="col-span-12 md:col-span-12">
                        <label htmlFor="AdminProfileClient-avatar" className="field-label">Profile Picture</label>
                        <input id="AdminProfileClient-avatar"
                            type="file"
                            name="avatar"
                            accept="image/*"
                            className="field"
                            ref={fileInputRef}
                        />
                    </div>

                    {/* Change Password */}
                    <div className="col-span-12 md:col-span-4">
                        <label htmlFor="AdminProfileClient-password" className="field-label">Old Password</label>
                        <input id="AdminProfileClient-password"
                            type="password"
                            name="password"
                            className="field"
                            {...formRegister("password")}

                        />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <label htmlFor="AdminProfileClient-newPassword" className="field-label">New Password</label>
                        <input id="AdminProfileClient-newPassword"
                            type="password"
                            name="newPassword"
                            className="field"
                            {...formRegister("newPassword")}

                        />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <label htmlFor="AdminProfileClient-confirmPassword" className="field-label">Confirm New Password</label>
                        <input id="AdminProfileClient-confirmPassword"
                            type="password"
                            name="confirmPassword"
                            className="field"
                            {...formRegister("confirmPassword")}
                        />
                    </div>

                    <div className="flex gap-2 justify-end mt-4 col-span-12">
                        <button type="reset" className="btn-ghost">Reset</button>
                        <button type="submit" className="classic">Save changes</button>
                    </div>
                </form>
            </div>

        </>
    );
}
