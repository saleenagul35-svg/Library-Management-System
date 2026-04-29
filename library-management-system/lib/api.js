"use client"



const BASE_URL = "http://localhost:5000"
let isRefreshing = false
let queue = []
const customFetch = async (url, options = {}) => {

    try {

        const token = localStorage.getItem("Admintoken")

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
                localStorage.setItem("Admintoken", data.accessToken)
                queue.forEach((cb) => cb(data.accessToken))
                queue = []
                isRefreshing = false

                config.headers["Authorization"] = `Bearer ${data.accessToken}`
                response = await fetch(BASE_URL + url, config)
            } else {
                await fetch(`${BASE_URL}/api/adminLogout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                localStorage.removeItem("Admintoken")
                document.cookie = `Admintoken=; path=/; max-age=0`
                window.location.href = "/authentication/admin"
            }
        }
        return response
    } catch (error) {
        console.log("customFetch internal error:", error.message)  // ← exact error dekhain
        throw error
    }
}
export default customFetch