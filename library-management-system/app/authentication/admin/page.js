"use client"
import Image from "next/image";
import admin from "../../../public/images/admin.png"
import { useState } from "react";



// ================= LOGIN PAGE =================
export default function AdminLoginPage() {

  const [handleform, setHandleForm] = useState({ email: "", password: "" })

  const formData = (e) => {
    const { name, value } = e.target
    setHandleForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const adminPage = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/adminVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(handleform)


      })

      if (response.ok) {
        const data = await response.json()
        console.log(data);
        localStorage.setItem("Admintoken", data.token)
        window.location.href = "/admin"
      }else{
        console.log(await response.text())
      }


    } catch (error) {
      console.log(error);

    }


  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf5e1] px-4 py-6" id="LoginPage">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-[#fcfdea] rounded-2xl shadow-lg overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:flex items-center justify-center p-4 ">
          <Image
            src={admin}
            alt="admin"
            className="w-full h-auto object-contain rounded-4xl"
          />
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <form onSubmit={adminPage} className="w-full max-w-md">
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
                placeholder="example@mail.com"
                className="w-full px-4 py-2 border border-[#864c25] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#864c25]"
              />
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
            </div>

            {/* Button */}
            <button className="w-full bg-[#864c25] text-[#fffff3] py-3 rounded-lg transition hover:opacity-90">
              Login
            </button>



          </form>
        </div>
      </div>
    </div>
  );
}

