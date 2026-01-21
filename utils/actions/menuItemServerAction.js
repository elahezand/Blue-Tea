"use server"
import connectToDB from "@/configs/db";
import { menuSchema } from "@/validators/menuItem";
import { createResponse } from "../helper";
import { authAdmin } from "../auth";
import handleFileUpload from "../serverFile";
import menuItemModel from "@/model/menuItem";
export async function NewMenuItem(prevState, formData) {
    try {
        await connectToDB();
        const admin = await authAdmin()
        if (!admin) return createResponse(403, "UnAuthorized");


        const rawData = Object.fromEntries(formData.entries());
        const proccessData = {
            ...rawData,
            price: Number(rawData.price),
            size: rawData.size?.split(",").map(s => s.trim())
        }
        const validation = menuSchema.safeParse(proccessData);
        if (!validation.success) {
            return createResponse(400, " Please Fill Out Form Correctly  ", null, validation.error.flatten().fieldErrors);
        }
        const isMenuItemExist = await menuItemModel.findOne({ name: validation.data.name })
        if (isMenuItemExist) {
            return createResponse(409, "MenuItem Already Existed");
        }

        const image = await handleFileUpload(formData.get("img"));
        await menuItemModel.create({
            ...validation.data,
            image,
        });

        return createResponse(201, "Product Created Successfully:)");

    } catch (err) {
        console.error("Critical Error in NewMenuItem Action:", err);
        return createResponse(500, "UNKNOWN ERROR");
    }
}

