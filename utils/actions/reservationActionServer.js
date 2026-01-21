"use server"
import { reservationValidationSchema } from "@/validators/reservation";
import connectToDB from "@/configs/db";
import reservationModal from "@/model/reservation";
import { createResponse } from "../helper";
import { authAdmin } from "../auth";


export async function NewReservation(prevState, formData) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin || admin.role !== "ADMIN") {
            return createResponse(403, "UnAuthorized");
        }

        const rawData = Object.fromEntries(formData.entries());
        rawData.guests = Number(rawData.guests);

        const validation = reservationValidationSchema.safeParse(rawData);
        if (!validation.success) {
            return createResponse(400, "Please Fill Out Form Correctly!", null, validation.error.flatten().fieldErrors);
        }
        const name = formData.get("name")
        const phone = formData.get("phone")

        const isResevationExist = await reservationModal.findOne({ $or: [{ name }, { phone }] })
        if (isResevationExist) {
            return createResponse(409, "Reservation Already Existed !");
        }

        await reservationModal.create(validation.data)

        return createResponse(201, " Reservation Created successfully:)");
    }
    catch (err) {
        console.error("Critical Error in NewReservation Action:", err);
        return createResponse(500, "UNKNOWN ERROR");
    }
}


