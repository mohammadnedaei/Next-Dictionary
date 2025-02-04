"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {session ? (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Welcome, {session.user?.name}! 🎉</h1>
                    <p className="mt-2 text-gray-600">You can now manage your personal dictionary.</p>
                    <Link href="/dashboard">
                        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">Go to Dashboard</button>
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Welcome to Next Dictionary</h1>
                    <p className="mt-2 text-gray-600">Sign in to add and manage your words.</p>
                </div>
            )}
        </div>
    );
}
