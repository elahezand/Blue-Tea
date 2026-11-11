export interface SendCodeBody {
    phone: string
}

export interface VerifyCodeBody {
    phone: string
    code: string
}
