"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import {User} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="p-6 bg-gray-800 text-white flex justify-between items-center">
            <div className="flex items-center justify-center ml-4 flex-row-reverse">
                <Link href={"/"} className="mx-2 text-lg min-w-max">Next Dictionary</Link>
                <Image src={"/icon.png"} alt={"navbar icon"} width={40} height={40} />
            </div>


            {session?.user ? (
                <div className="flex items-center gap-4 w-full justify-end ">
                    <div className="hidden md:flex items-center gap-2 flex-row-reverse align-middle justify-center">
                        <span className="font-bold ">{session.user.name} </span>
                        <User />
                    </div>

                    <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-red-500 px-4 py-2 rounded-lg">Sign Out</button>
                </div>
            ) : (
                <button onClick={() => signIn("google")} className="bg-green-500 px-4 py-2 rounded-lg">Sign In</button>
            )}
        </nav>
    );
}
