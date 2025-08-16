// import { resend } from "./resend";
import { transporter } from "./nodemailer";
import { renderVerificationEmailTemplate } from "./render-email-template";

export async function sendVerificationEmail(email, token) {
    let success = false;

    try {
        await transporter.sendMail({
            from: '"Khatabook" <noreply@khatabook.com>',
            to: email,
            subject: "Email Verification - Khatabook",
            html: await renderVerificationEmailTemplate(email.split('@')[0], token)
        })

        success = true;

        return { success, message: "Please check your email for further instructions!" };
    } catch (error) {
        console.log("Error sending verification email: ", error);

        return { success, message: "Failed to send verification email!" };
    }
}