
import { hash, compare } from "bcryptjs";
import connectToDB from "@/db/db";
import { cookies } from "next/headers";
import UserModal from "@/model/user";
import { sign, verify } from "jsonwebtoken";


const hashPassword = async (password) => {
    const hashedPasswored = await hash(password, 12)
    return hashedPasswored
}

const verifyPassword = async (password, hashedPasswored) => {
    const verifiedPassword = await compare(password, hashedPasswored)
    return verifiedPassword
}

const generateToken = async (data) => {
    const token = await sign(
        { ...data },
        process.env.ACCESS_TOKEN,
        { algorithm: "HS256", expiresIn: "60s" }
    );
    return token;
}

const verifyToken = async (token) => {
    try {
        return await verify(token, process.env.ACCESS_TOKEN)
    } catch  {
        return null
    }
}

const generateRefreshToken = async (data) => {
    const token = await sign({ ...data },
        process.env.REFRESH_TOKEN,
        {
            algorithm: "HS256",
            expiresIn: "15d"
        })

    return token
}

const verifyRefreshToken = async (token) => {
    try {
        return await verify(token, process.env.REFRESH_TOKEN)
    } catch  {
        return null
    }
}

const authUser = async () => {
    connectToDB()
    let user = null

    const cookiesStore = await cookies()
    const token = cookiesStore.get("token")
    if (!token) return null

    const payloadToken = await verifyToken(token.value)
    if (!payloadToken) return { status: "expired" }

    user = await UserModal.findOne({ email: payloadToken.email })

    if (!user) return null

    return user
}

const authAdmin = async () => {
    connectToDB()
    let user = null

    const cookiesStore = await cookies()
    const token = cookiesStore.get("token")
    if (!token) return null

    const payloadToken = await verifyToken(token.value)
    if (!payloadToken) return { status: "expired" }

    user = await UserModal.findOne({ email: payloadToken.email })

    if (!user) return null
    if (user.role !== "ADMIN") return user

    return user
}

const getMe = async () => {
    connectToDB()
    const cookiesStore = await cookies()
    const token = cookiesStore.get("refreshToken")

    if (!token) return null

    const payloadToken = await verifyRefreshToken(token.value)

    if (!payloadToken) return null

    const user = await UserModal.findOne({ email: payloadToken.email })
    if (!user) return null

    return user

}


export {
    authUser,
    authAdmin,
    getMe,
    hashPassword,
    verifyPassword,
    verifyToken,
    generateToken,
    generateRefreshToken,
    verifyRefreshToken
}