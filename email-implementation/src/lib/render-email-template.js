import { render } from "@react-email/components";
import VerificationEmail from "@/emails/verification-email";

const renderVerificationEmailTemplate = async (username, token) => {
    return render(<VerificationEmail username={username} token={token} />)
}

export { renderVerificationEmailTemplate };