import { NextPage } from "next"
import { SigninForm } from "./SignInPage"

const SigninPage: NextPage = () => {
    return (
        <div>
            <h1>ログイン</h1>
            <SigninForm />
        </div>
    )
}

export default SigninPage