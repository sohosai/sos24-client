
export const fetcherWithToken = async (url: string, token?: string) => {
    if (!token) {
        throw new Error("Unauthorized")
    }

    return await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json())

}