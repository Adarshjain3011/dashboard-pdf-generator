import mongoose from "mongoose";


interface IUser extends Document{

    name: string;
    email: string;
    password: string;

}


const userSchema = new mongoose.Schema({

    name: {

        type: String,
        required: true,

    },
    email: {

        type: String,
        required: true,

    },

    password: {

        type: String,
        required: true,

    }
}, {

    timestamps: true
})

export const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;





