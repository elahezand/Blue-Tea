"use client"
import MenuItemForm from "./menuItemForm"
import { useCreateMenuItem } from "@/services/menu.service"
import { applyFieldErrors } from "@/utils/apiError"

export default function AddnewMenuItem() {
    const { mutate: createItem, isPending } = useCreateMenuItem()

    return (
        <MenuItemForm isPending={isPending} submitLabel="Create item"
            onSave={(formData, done, setError) => createItem(formData, { onSuccess: done, onError: (error) => applyFieldErrors(error, setError) })} />
    )
}
