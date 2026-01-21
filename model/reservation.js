import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            trim: true,
        },

        date: {
            type: data,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        guests: {
            type: Number,
            required: true,
            min: 1,
        },

        notes: {
            type: String,
            trim: true, // optional message
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        }
    }
);

const reservationModal = mongoose.models.Reservation ||
    mongoose.model("Reservation", ReservationSchema);

export default reservationModal