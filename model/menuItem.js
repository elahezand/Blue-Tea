import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
        },

        description: {
            type: String,
            trim: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        image: {
            type: String, // optional
        },

        size: {
            type: [String],
            required: false,
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

const menuItemModel = mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
export default menuItemModel