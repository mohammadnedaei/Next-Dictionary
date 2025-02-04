"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/"); // Redirect to homepage if not authenticated
        }
    }, [status, router]);

    if (status === "loading") {
        // Show a loading state while checking session
        return <p>Loading...</p>;
    }

    return <>{children}</>; // Render the protected content
}
