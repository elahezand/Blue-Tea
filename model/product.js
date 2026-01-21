const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    longDescription: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 5,
    },
    img: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    isAvailable: { type: Boolean, default: true },

    variants: {
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

const ProductModel = mongoose.models.Product || mongoose.model("Product", schema)

export default ProductModel