import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import swal from '@/components/modules/swal'
import type { Category, MenuItem } from '@/types/models'

interface EditModalProps {
    title: string
    item: MenuItem & { size?: string }
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export default function EditModal({ title, item, setShowModal }: EditModalProps) {
    const [form, setForm] = useState({
        name: item.name,
        price: String(item.price),
        description: item.description,
        size: item.size ?? "",
        category: typeof item.category === "string" ? item.category : (item.category as Category)._id
    });

    const editHandeler = async (e: FormEvent) => {
        e.preventDefault();

        swal({
            title: "Are You Sure To Edit This item?",
            icon: "warning",
            buttons: ["No", "Yes"],
        }).then((result) => {
            if (!result) return;

            const formData = new FormData();
            const id = item._id
            formData.append("_id", id);
            formData.append("name", form.name);
            formData.append("price", form.price);
            formData.append("description", form.description);
            formData.append("size", form.size);
            formData.append("category", form.category);


            // TODO: update-menu-item request (removed for now): PUT /menu/:id with formData
            void formData
        });
    }


    return (
        <div className="fixed inset-0 z-[10000] flex justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="mt-20 h-fit max-h-[85vh] w-[460px] max-w-full animate-modal-pop overflow-y-auto rounded-3xl border border-solid border-line bg-surface p-7 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="m-0 text-2xl" style={{ color: "var(--head)" }}>{title}</h3>
                    <button type="button" aria-label="Close" onClick={() => setShowModal(false)} className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-2xl text-fg hover:bg-soft">&times;</button>
                </div>
                <form>
                    <div className="mb-[15px]">
                        <label htmlFor="title" className="field-label">Title</label>
                        <input type="text"
                            defaultValue={item.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}

                            id="title" name="title"
                            className="field"
                            placeholder="Enter title" />
                    </div>
                    <div className="mb-[15px]">
                        <label htmlFor="author" className="field-label">Price</label>
                        <input type="text" id="author"
                            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                            defaultValue={item.price}
                            className="field"
                            name="Price" placeholder="Price" />
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="shortDesc" className="field-label">Short Description</label>
                        <textarea id="shortDesc"
                            name="shortDescription"
                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                            defaultValue={item.description}
                            className="field min-h-[70px] resize-y"
                            placeholder="Short description"></textarea>
                    </div>
                    <div className="md:w-1/2">
                        <label className="field-label">Size</label>
                        <input type="text"
                            onChange={(e) => setForm(prev => ({ ...prev, size: e.target.value }))}
                            defaultValue={item.size}
                            className="field" placeholder="M,L,S" />
                    </div>
                    <div className="mt-5 flex justify-end gap-[10px]">
                        <button type="button"
                            onClick={() => setShowModal(false)}
                            className="btn-ghost">Cancel</button>
                        <button
                            onClick={(e) => editHandeler(e)}
                            className="classic">Save</button>
                    </div>
                </form>
            </div>
        </div>

    )
}
