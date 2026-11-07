"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountDetailSchema, type AccountDetailInput } from "@/validators/user";
import type { User } from "@/types/models";

export default function AdminProfileClient({ adminData }: { adminData: User | null }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountDetailInput>({
        resolver: zodResolver(accountDetailSchema),
        defaultValues: {
            name: adminData?.name ?? "",
            email: adminData?.email ?? "",
            phone: adminData?.phone ?? "",
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

        // TODO: update-profile request (removed for now): PUT /users/:id with data. On success: toast + router.refresh()
        void adminData
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
                            className="field"
                            {...formRegister("name")}
                            required
                        />
                    </div>
                    <div className="col-span-12 md:col-span-12">
                        <label htmlFor="AdminProfileClient-email" className="field-label">Email</label>
                        <input id="AdminProfileClient-email"
                            type="email"
                            className="field"
                            {...formRegister("email")}
                            required
                        />
                    </div>
                    <div className="col-span-12 md:col-span-12">
                        <label htmlFor="AdminProfileClient-phone" className="field-label">Phone</label>
                        <input id="AdminProfileClient-phone"
                            type="text"
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

                    <div className="flex gap-2 justify-end mt-4 col-span-12">
                        <button type="reset" className="btn-ghost">Reset</button>
                        <button type="submit" className="classic">Save changes</button>
                    </div>
                </form>
            </div>

        </>
    );
}
