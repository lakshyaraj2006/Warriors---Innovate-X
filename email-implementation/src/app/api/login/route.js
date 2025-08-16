import { connectDb } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { UserModel } from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(request) {
    await connectDb();

    const _jsonData = await request.json();
    let success = false;

    const { email } = _jsonData;
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    if (!email) {
        return NextResponse.json({
            success,
            message: 'All the fields are required!'
        }, { status: 400 })
    } else if (!emailRegex.test(email)) {
        return NextResponse.json({
            success,
            message: 'Invalid email address!'
        }, { status: 400 })
    } else {
        let user = await UserModel.findOne({ email });

        if (user) {
            if (user.isVerified) {
                if (user.verifyTokenExpiry < new Date()) {
                    return NextResponse.json({
                        success,
                        message: 'Login token already sent!'
                    }, { status: 400 })
                } else {
                    const verifyToken = crypto.randomBytes(16).toString('hex');
                    const verifyTokenExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000);

                    user.verifyToken = verifyToken;
                    user.verifyTokenExpiry = verifyTokenExpiry;

                    await user.save();

                    const emailResponse = await sendVerificationEmail(email, verifyToken);

                    if (!emailResponse.success) {
                        return NextResponse.json({
                            success,
                            message: "Error sending login token!"
                        }, { status: 500 })
                    } else {
                        success = true;

                        return NextResponse.json({
                            success,
                            message: "Login token has been sent!"
                        }, { status: 200 })
                    }
                }
            } else {
                return NextResponse.json({
                    success,
                    message: 'Please verify your email first!'
                }, { status: 400 })
            }
        } else {
            const verifyToken = crypto.randomBytes(16).toString('hex');
            const verifyTokenExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000);

            user = new UserModel({
                email: _jsonData['email'],
                verifyToken,
                verifyTokenExpiry
            });
            await user.save();

            const emailResponse = await sendVerificationEmail(email, verifyToken);

            if (!emailResponse.success) {
                return NextResponse.json({
                    success,
                    message: emailResponse.message
                }, { status: 500 })
            } else {
                success = true;

                return NextResponse.json({
                    success,
                    message: emailResponse.message
                }, { status: 200 })
            }
        }
    }

}