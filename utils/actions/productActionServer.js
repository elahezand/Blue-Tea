"use server"
import connectToDB from "@/configs/db";
import ProductModal from "@/model/product";
import { productSchema } from "@/validators/product";
import handleFileUpload from "../serverFile";
import { createResponse } from "../helper";
import { authAdmin } from "../auth";
export async function NewProduct(prevState, formData) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) return createResponse(403, "UnAuthorized");

        const rawData = Object.fromEntries(formData.entries());
        const processedData = {
            ...rawData,
            price: Number(rawData.price),
            score: rawData.score ? Number(rawData.score) : undefined,
            tags: rawData.tags ? rawData.tags.split(",").map(t => t.trim()) : [],
            variants: rawData.variants ? rawData.variants.split(",").map(v => v.trim()) : [],
        };

        const validation = productSchema.safeParse(processedData);
        if (!validation.success) {
            return createResponse(400, " Please Fill Out Form Correctly  ", null, validation.error.flatten().fieldErrors);
        }

        const isProductExist = await ProductModal.findOne({ name: validation.data.name })
        if (isProductExist) {
            return createResponse(409, "Product Already Existed");
        }
        const img = await handleFileUpload(formData.get("img"));

        await ProductModal.create({
            ...validation.data,
            img: img
        })

        return createResponse(201, "Product Created Successfully:)");
    }
    catch (err) {
        console.error("Critical Error in NewProduct Action:", err);
        return createResponse(500, "UNKNOWN ERROR");
    }
}
