import VerifyComponent from "@/components/VerifyComponent"
import { cookies } from "next/headers";

export const metadata = {
    title: "Verify | NextJS Authentication"
}

export default async function VerifyPage({ params }) {
    const { token } = await params;
    const cookiesStore = await cookies();

    return (
        <>
            {token && <VerifyComponent token={token} authToken={cookiesStore.get("authtoken")} />}
            {!token &&
                <h1 className="text-xl md:text-2xl text-center font-bold flex items-center justify-center gap-4">
                    {verifying ? <><Loader2Icon className="animate-spin" /> <span>Verifying...</span></> : message}
                </h1>}
        </>
    )
}