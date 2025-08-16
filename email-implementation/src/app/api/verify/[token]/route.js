import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request, { params }) {
    const cookiesStore = await cookies();
    await connectDb();
    const { token } = await params;
    let success = false;

    try {
        const user = await UserModel.findOne({ verifyToken: token });

        if (user) {
            const payload = {
                id: user._id,
                email: user.email
            }
            if (user.isVerified) {
                success = true;

                cookiesStore.set(
                    'authtoken',
                    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }),
                    {
                        maxAge: 24 * 60 * 60,
                        secure: process.env.NODE_ENV === "production"
                    }
                )

                return NextResponse.json({
                    success,
                    message: "Logged in successfully!"
                }, { status: 200 })
            } else {

                const tokenHasExpired = (new Date() > user.verifyTokenExpiry) ? true : false;

                if (tokenHasExpired) {
                    return NextResponse.json({
                        success,
                        message: "Token has expired!"
                    }, { status: 400 })
                } else {
                    await UserModel.findByIdAndUpdate(user.id, {
                        $set: { isVerified: true },
                        $unset: { verifyToken: true, verifyTokenExpiry: true }
                    });
                    success = true;

                    cookiesStore.set(
                        'authtoken',
                        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }),
                        {
                            maxAge: 24 * 60 * 60,
                            secure: process.env.NODE_ENV === "production"
                        }
                    )

                    return NextResponse.json({
                        success,
                        message: "Email verified successfully!"
                    }, { status: 200 })
                }
            }
        } else {
            return NextResponse.json({
                success,
                message: "Invalid verification token!"
            }, { status: 401 })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success,
            message: "Internal Server Error!"
        }, { status: 500 })
    }
}