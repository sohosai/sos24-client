"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

type CreateUserInput = {
    name: string,
    kana_name: string,

    phone_number: string,
    category: "undergraduate" | "graduate" | "academic_staff"

    email: string,
    password: string
}

export const SignupForm = () => {

    const { register, handleSubmit } = useForm<CreateUserInput>()

    const onSubmit = async (data: CreateUserInput) => {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: data.name,
                kana_name: data.kana_name,
                phone_number: data.phone_number,
                category: data.category,
                email: data.email,
                password: data.password,
            })
        }).then(res => res.status)

        if (resp === 201) {
            toast.success("登録しました")
        }
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
            <div>
                <label htmlFor="name">名前</label>
                <input type="text" id="name" {...register("name")} />
            </div>
            <div>
                <label htmlFor="kana_name">フリガナ</label>
                <input type="text" id="kana_name" {...register("kana_name")} />
            </div>
            <div>
                <label htmlFor="phone_number">電話番号</label>
                <input type="tel" id="phone_number" {...register("phone_number")} />
            </div>
            <div>
                <label htmlFor="category">所属</label>
                <select id="category" {...register("category")}>
                    <option value="undergraduate">学類生</option>
                    <option value="graduate">大学院生</option>
                    <option value="academic_staff">教職員</option>
                </select>
            </div>
            <button type="submit">登録</button>
        </form>
    )
}