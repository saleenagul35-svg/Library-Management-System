
const BASE_URL = "http://localhost:5000"

const customFetch = async (url, options = {}) => {
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
            config.headers["Authorization"] = `Bearer ${data.accessToken}`
            response = await fetch(BASE_URL + url, config)
        } else {
            localStorage.removeItem("Admintoken")
            window.location.href = "/authentication/admin"
        }
    }
    return response
}
export default customFetch