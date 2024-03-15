"use client"

import { fetcherWithToken } from "@/lib/swr";
import { NextPage } from "next";
import useSWR from "swr";
import { NewsList } from "./NewsList";
import { css } from "@styled-system/css";

const DashboardPage: NextPage = () => {
    const news = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/news`, fetcherWithToken)

    return (
        <div className={css({
            padding: 5,
        })}>
            <NewsList newsList={[
                {
                    id: "ID",
                    title: "タイトル",
                    updated_at: new Date().toISOString(),
                },
                {
                    id: "ID",
                    title: "タイトル",
                    updated_at: new Date().toISOString(),
                }
            ]} />
        </div>
    )
}

export default DashboardPage