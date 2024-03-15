import { NextPage } from "next";
import { SignupForm } from "./SignupForm";

const SignupPage: NextPage = () => {

    return (
        <div>
            <h1>新規登録</h1>
            <SignupForm />
        </div>
    )
}

export default SignupPage;