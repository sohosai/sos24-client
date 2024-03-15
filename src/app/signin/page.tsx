import { NextPage } from "next"
import { SigninForm } from "./SignInPage"

export const SigninPage: NextPage = () => {
    return (
        <div>
            <h1>ログイン</h1>
            <SigninForm />
        </div>
    )
}