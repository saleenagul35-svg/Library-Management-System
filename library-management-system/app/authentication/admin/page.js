"use client"
import Image from "next/image";
import admin from "../../../public/images/admin.jpg"
import { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useRouter } from "next/navigation";


// ================= LOGIN PAGE =================
export default function AdminLoginPage() {
  const [alert, setAlert] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [errors, setErrors] = useState({})
  const [handleform, setHandleForm] = useState({ email: "", password: "" })
  const router = useRouter()
  const formData = (e) => {
    const { name, value } = e.target
    setHandleForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const validation = () => {
    let newErrors = {}
    if (!handleform.email.trim()) {
      newErrors.email = "Enter your email address"
    }
    if (!handleform.password.trim()) {
      newErrors.password = "Enter your password"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const adminPage = async (e) => {
    e.preventDefault()
    if (!validation()) return
    setSubmit(true)
    if (validation()) {
      try {
        const response = await fetch("http://localhost:5000/api/adminVerification", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(handleform)


        })
        const data = await response.json()
        if (response.ok) {


          localStorage.setItem("Admintoken", data.accessToken)
          router.push("/admin")

        } else {
          setAlert(`${data.message}`)
        }


      } catch (error) {
        setAlert("Something went wrong.")

      } finally {
        setSubmit(false)
      }
    }

  }
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [alert])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf5e1] px-4 py-6" id="LoginPage">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-[#fcfdea] rounded-2xl shadow-lg overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:flex items-center justify-center p-4  relative">
          <Image
            src="https://res.cloudinary.com/dvu3gnyjt/image/upload/v1777146837/admin_t8q7se.jpg"
            priority
            fill
            alt="admin"
            className="w-full h-auto object-contain rounded-4xl"
          />
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <form className="w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-[#515427] mb-2 text-center md:text-left">
              Welcome Back Admin
            </h2>
            <p className="text-[#515427] mb-6 text-center md:text-left">
              Login to your account
            </p>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-[#515427] mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={handleform.email}
                onChange={formData}
                autoComplete="email"
                placeholder="example@mail.com"

                className="w-full px-4 py-2 border border-[#864c25] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#864c25]"
              />
              {errors.email &&
                <p className="text-sm text-red-700">{errors.email}</p>
              }
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm text-[#515427] mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={handleform.password}
                onChange={formData}
                placeholder="********"

                className="w-full px-4 py-2 border border-[#864c25] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#864c25]"
              />
              {errors.password &&
                <p className="text-sm text-red-700">{errors.password}</p>
              }
            </div>

            {/* Button */}
            <button
              disabled={submit}
              onClick={adminPage}
              className="w-full bg-[#864c25] text-[#fffff3] py-3 rounded-lg transition hover:opacity-90">
              Login
            </button>



          </form>
        </div>
        {alert && <Stack spacing={2} className="fixed top-5 right-16 w-100 ">
          <Alert sx={{ backgroundColor: "#fdfdef" }} severity="error">{alert}</Alert>
        </Stack>}
      </div>
    </div>
  );
}

