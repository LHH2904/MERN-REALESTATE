// Import mongoose để tạo schema và model
import mongoose from "mongoose";

// Định nghĩa schema cho bảng `users` trong MongoDB
const listingSchema = new mongoose.Schema({
        _id: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        furnished: {
            type: Boolean,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
