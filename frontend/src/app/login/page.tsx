"use client";

import {Input} from "@/components/ui/input";
import {get, post} from "@/utils/api";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import tokenService from "@/utils/token";
import {useRouter} from "next/navigation";

type User = {
    userName: string;
    password: string;
};

export default function Page() {
    let {toast} = useToast();
    let router = useRouter();
    let [username, setUsername] = useState<string>("");
    let [password, setPwd] = useState<string>("");

    async function handleLogin(): Promise<void> {
        let result = await post<User>(
            "user/login",
            {
                userName: username,
                password: password,
            },
            () => toast({title: "Login Error", variant: "destructive"})
        );
        if (result !== null) {
            tokenService.setToken(result);
            router.push("/");
        }
    }

    async function handleRegister(): Promise<void> {
        await post<User>(
            "user/register",
            {
                userName: username,
                password: password,
            },
            () => toast({title: "Register error", variant: "destructive"})
        );
        toast({title: "Registered"});
    }

    return (
        <div className="bg-green-200 h-screen flex items-center justify-center">
            <div
                className="bg-blue-400 h-1/4 p-5 max-w-md min-w-fit
        w-1/2 rounded-xl shadow-xl flex flex-col justify-evenly gap-1"
            >
                <Input
                    type="text"
                    value={username}
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="password"
                />
                <Button onClick={() => handleLogin()}> Log In </Button>
                <Button onClick={() => handleRegister()}> Register</Button>
            </div>
        </div>
    );
}
