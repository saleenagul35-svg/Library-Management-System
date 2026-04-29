"use client"
const BASE_URL = "http://localhost:5000"
let isRefreshing = false
let queue = []
const customFetch = async (url, options = {}) => {

    try {


        let token = localStorage.getItem("activeUser")
        const config = {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            }
        }

        let response = await fetch(BASE_URL + url, config)

        if (response.status === 401) {
            if (isRefreshing === true) {
                return new Promise((resolve) => {
                    queue.push((newToken) => {
                        config.headers["Authorization"] = `Bearer ${newToken}`
                        resolve(fetch(BASE_URL + url, config))
                    })
                })
            }
            isRefreshing = true
            const refresRes = await fetch(`${BASE_URL}/api/refreshTokenAuth`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (refresRes.ok) {
                const data = await refresRes.json()
                localStorage.setItem("activeUser", data.accessToken)
                queue.forEach((cb) => cb(data.accessToken))
                queue = []
                isRefreshing = false

                config.headers["Authorization"] = `Bearer ${data.accessToken}`
                response = await fetch(BASE_URL + url, config)
            } else {
                await fetch(`${BASE_URL}/api/userLogout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                localStorage.removeItem("activeUser")
                document.cookie = `activeUser=; path=/; max-age=0`
                window.location.href = "/authentication/login"
            }
        }
        return response
    } catch (error) {
        console.log("customFetch internal error:", error.message)  // ← exact error dekhain
        throw error
    }
}
export default customFetch