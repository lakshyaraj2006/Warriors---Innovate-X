"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Logged out successfully!");
        router.push("/home");
      } else {
        toast.error("Failed to log out. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>

        <button onClick={handleLogout} className="btn btn-error btn-wide">
          Logout
        </button>
      </div>
    </div>
  );
}
