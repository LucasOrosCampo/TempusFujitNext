"use server";

import { User } from "@prisma/client";
import { db } from "../libs/db";
import { randomInt } from "crypto";

export async function create_user(){
    let newUsername = `test username ${randomInt(9000)}`
    let newUser =  { data: {
        username: newUsername,
        password: 'test password'
    }}
    await db.user.create(newUser)
}
export async function delete_all(){
    await db.user.deleteMany({})
}

export async function get_user(): Promise<User | null>{
    let result = await db.user.findFirst()
    return result
}

export async function get_all(): Promise<User[] | null>{
    return  await db.user.findMany({})
}