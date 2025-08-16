import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: {
        type: String
    },
    verifyTokenExpiry: {
        type: Date
    }
}, { timestamps: true });

mongoose.models = {};
const UserModel = mongoose.model('User', UserSchema);

export { UserModel };