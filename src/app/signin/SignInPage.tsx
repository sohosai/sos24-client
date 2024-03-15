import { useForm } from "react-hook-form";

export const SigninForm: React.FC = () => {
    const { register, handleSubmit } = useForm<{ email: string; password: string }>();

    const onSubmit = () => {
        // TODO: handle form submit
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email">メールアドレス</label>
                <input type="email" id="email" {...register("email")} />
            </div>
            <div>
                <label htmlFor="password">パスワード</label>
                <input type="password" id="password" {...register("password")} />
            </div>
            <button type="submit">ログイン</button>
        </form>
    )
}