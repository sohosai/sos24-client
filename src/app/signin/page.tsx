"use client"

import { NextPage } from "next"
import { SigninForm } from "./SignInPage"
import NextLink from "next/link"
import { redirect } from "next/navigation"
import { useAuthState } from "@/lib/firebase"

const SigninPage: NextPage = () => {
    const { user, isLoading } = useAuthState()

    if (!isLoading && user) {
        redirect("/dashboard")
    }

    return (
        <div>
            <h1>ログイン</h1>
            {
                isLoading ?
                    (<p>Loading...</p>)
                    :
                    (<>
                        <SigninForm />
                        <p>アカウントをお持ちでない場合は <NextLink href="/signup">新規登録</NextLink> してください</p>
                    </>)
            }
        </div>
    )
}

export default SigninPage