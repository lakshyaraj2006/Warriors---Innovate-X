"use client"

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function VerifyComponent(props) {
    const router = useRouter();
    const { token, authToken } = props;
    const [verifying, setVerifying] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        verifyToken();
    }, [])

    const verifyToken = () => {
        axiosInstance.post(`/verify/${token}`, null, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                const { success, message } = response.data;

                if (success) {
                    toast.success(message, {
                        autoClose: 2500
                    });
                    setVerifying(false);
                    setMessage(message);

                    setTimeout(() => {
                        router.replace(authToken ? '/profile' : '/');
                    }, 2700);
                } else {
                    toast.error(message, {
                        autoClose: 2500
                    });
                    setVerifying(false);
                    setMessage(message);
                }
            })
            .catch(error => {
                const { success, message } = error.response.data;
                toast.error(message, {
                    autoClose: 2500
                });
                setVerifying(false);
                setMessage(message);
            });
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-2xl text-center font-bold flex items-center justify-center gap-4">
                {verifying ? <><span>Verifying...</span></> : message}
            </h1>
        </div>
    )
}