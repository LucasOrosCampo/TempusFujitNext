"use client";
import {get} from "@/utils/api";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import tokenService from "@/utils/token";
import {useRouter} from "next/navigation";
import Home from "./home";

export default function Entrypoint() {
    let router = useRouter();
    let [isAuthed, setIsAuthed] = useState<boolean>(false);
    let [username, setUsername] = useState<string | undefined>(undefined);

    async function tryToken() {
        var result = await get<boolean>("user/validate/token", () => {
            router.push("/login");
        });
        let token = tokenService.getToken();
        if (result && token !== null) {
            let jwt = jwtDecode(token!);
            jwt.sub !== undefined && setUsername(jwt?.sub);
        }
        setIsAuthed(result);
    }

    useEffect(() => {
        tryToken();
    }, []);

    return (
        <>
            {isAuthed && (
                <div className="h-screen flex flex-col">
                    <div
                        className="flex items-center justify-center h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-wide">
                            {"bienvenido " + username}
                        </h1>
                    </div>
                    <Home/>
                </div>
            )}
        </>
    );
}
