"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
export default function updateBookForm() {
  const [alert, setAlert] = useState(false)
  const router = useRouter()
  const useSrchPrms = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [handleform, setHandleForm] = useState({ Title: "", Author: "", ISBN: "", Genre: "", Publisher: "", Year: "", Language: "", Copy: "", Pages: "", Description: "", ImageURL: "" })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const imageHandler = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)
    }
  }
  const book = useSrchPrms.get("book")

  const [errors, setErrors] = useState({})
  const [parsed, setParsed] = useState(null);
  const formData = (e) => {
    const { name, value } = e.target;
    setHandleForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const validation = () => {
    const currentYear = new Date().getFullYear()
    const yearnum = handleform.Year
    let newErrors = {}
    if (handleform.Title.trim().length < 3) {
      newErrors.Title = "Title must be atleast 3 characters"
    }
    if (!handleform.Title.trim()) {
      newErrors.Title = "Title*"
    }
    if (handleform.Author.trim().length < 3) {
      newErrors.Author = "Author name must be atleast 3 characters"
    }
    if (!handleform.Author.trim()) {
      newErrors.Author = "Author*"
    }
    if (!/^[A-Za-z\s\-]{3,}$/.test(handleform.Genre)) {
      newErrors.Genre = "Enter a valid Genre"
    }
    if (!handleform.Genre.trim()) {
      newErrors.Genre = "Genre*"
    }
    if (handleform.Publisher.trim().length < 3) {
      newErrors.Publisher = "Publisher name must be atleast 3 characters"
    }
    if (!handleform.Publisher.trim()) {
      newErrors.Publisher = "Publisher*"
    }
    if (!/^[A-Za-z\s\-]{3,}$/.test(handleform.Language)) {
      newErrors.Language = "Enter a valid Language"
    }
    if (!handleform.Language.trim()) {
      newErrors.Language = "Language*"
    }
    if (handleform.Description.trim().length < 30) {
      newErrors.Description = "Synopsis must be atleast 30 characters"
    }
    if (handleform.Description.trim().length > 1000) {
      newErrors.Description = "Synopsis cannot be greater than 1000 characters"
    }
    if (!handleform.Description.trim()) {
      newErrors.Description = "Synopsis*"
    }

    if (!/^\d{1,}$/.test(handleform.Pages)) {
      newErrors.Pages = "Enter valid page count"
    }

    if (handleform.Pages < 5) {
      newErrors.Pages = "Page count must be atleast 5*"
    }
    if (handleform.Pages.length === 0) {
      newErrors.Pages = "Pages*"
    }
    if (!/^\d{1,}$/.test(handleform.Copy)) {
      newErrors.Copy = "Enter valid Copy count"
    }
    if (handleform.Copy == 0) {
      newErrors.Copy = "Copy count must be atleast 1"
    }
    if (handleform.Copy.length === 0) {
      newErrors.Copy = "Copy*"
    }
    if (!/^\d{3}-\d{1}-\d{2}-\d{6}-\d{1}$/.test(handleform.ISBN)) {
      newErrors.ISBN = "Enter valid ISBN"
    }
    if (handleform.ISBN.length === 0) {
      newErrors.ISBN = "ISBN*"
    }
    if (!/^\d{4}$/.test(handleform.Year)) {
      newErrors.Year = "Enter four digit year"
    }
    if (currentYear < yearnum) {
      newErrors.Year = `Year cannot be greater than ${currentYear}`
    }
    if (handleform.Year.length === 0) {
      newErrors.Year = "Year*"
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const CloudinaryUploading = async () => {

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile)
      formData.append("upload_preset", "books_preset")
      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dvu3gnyjt/image/upload", {
          method: "POST",
          body: formData
        })
        const data = await response.json()
        console.log(data.secure_url);

        return data.secure_url


      } catch (error) {
        setAlert("Something went wrong.")

      }
    } else {
      return handleform.ImageURL
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation()) return
    setSubmitting(true)
    const URL = await CloudinaryUploading()
    if (URL) {

      try {
        const bookId = parsed._id
        const token = localStorage.getItem('Admintoken')
        const headers = {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
        const response = await fetch(`http://localhost:5000/api/editBook/${bookId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            ...handleform,
            ImageURL: URL
          })
        })
        if (response.ok) {
          router.push("/admin/inventory")
        }

      } catch (error) {
        setAlert("Something went wrong.")

      } finally {
        setSubmitting(false)
      }
    }
  };

  const cancel = () => {
    window.location.href = "/admin/inventory"
  }
  useEffect(() => {
    if (book) {
      const parsedBook = JSON.parse(book)
      setParsed(parsedBook)
      setHandleForm({ Title: parsedBook.Title || "", Author: parsedBook.Author || "", ISBN: parsedBook.ISBN || "", Genre: parsedBook.Genre || "", Publisher: parsedBook.Publisher || "", Year: parsedBook.Year || "", Language: parsedBook.Language || "", Copy: parsedBook.Copy || "", Pages: parsedBook.Pages || "", Description: parsedBook.Description || "", ImageURL: parsedBook.ImageURL || "" })
    }

  }, [book])
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [alert])
  return (
    <div className="min-h-screen bg-[#fcf5e1] font-sans">

      {/* Edit Mode Top Strip */}
      <div className="bg-[#54552b] px-6 py-2 flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-[#f5f0e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <p className="text-[11px] text-[#f5f0e0] font-medium tracking-widest uppercase">Editing Existing Record — Changes will overwrite current catalogue data</p>
      </div>

      {/* Page Header */}
      <div className="px-6 pt-4 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#54552b] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-[#f5f0e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#3a2e1e] tracking-tight">Edit Book Details</h1>
            <p className="text-xs text-[#9a8e7f] mt-0.5">
              Modify the fields below to update this catalogue entry.
            </p>
          </div>
        </div>

        {/* Unsaved badge */}
        <div className="flex items-center gap-1.5 bg-[#fdfaea] border border-[#d4c9b0] rounded-lg px-3 py-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#54552b]" />
          <span className="text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider">Unsaved Changes</span>
        </div>
      </div>

      {/* Required note */}
      <div className="px-6 mb-4">
        <p className="text-[11px] text-[#9a8e7f]">
          <span className="text-red-700">*</span> Fields marked with an asterisk are required.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pb-12 max-w-2xl mx-auto space-y-4">

        {/* Basic Information */}
        <section className="bg-[#fdfaea] rounded-xl border border-[#e8e0cc] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8d8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f5f0e0] border border-[#e8e0cc] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#7a6e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#3a2e1e]">Basic Information</h2>
                <p className="text-[11px] text-[#9a8e7f]">Core identifiers for this catalogue entry</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#9a8e7f] bg-[#f5f0e0] border border-[#e8e0cc] px-2 py-0.5 rounded-full">1 of 4</span>
          </div>

          <div className="px-5 py-5 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                Book Title <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="Title"
                  value={handleform.Title}
                  onChange={formData}
                  placeholder="e.g. The Name of the Rose"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                />
              </div>
              {errors.Title &&
                <p className="text-sm pl-1 text-red-700">{errors.Title}</p>
              }
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                Author <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="Author"
                  value={handleform.Author}
                  onChange={formData}
                  placeholder="e.g. Umberto Eco"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                />

              </div>
              {errors.Author &&
                <p className="text-sm pl-1 text-red-700">{errors.Author}</p>
              }
              <p className="mt-1.5 text-[11px] text-[#9a8e7f]">First name Last name format preferred</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  ISBN <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <input
                    type="text"

                    name="ISBN"
                    value={handleform.ISBN}
                    onChange={formData}
                    placeholder="978-0-15-144547-8"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                  />

                </div>
                {errors.ISBN &&
                  <p className="text-sm pl-1 text-red-700">{errors.ISBN}</p>
                }
                <p className="mt-1.5 text-[11px] text-[#9a8e7f]">13 digit format</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  Genre <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <input
                    name="Genre"
                    value={handleform.Genre}
                    onChange={formData}
                    placeholder="e.g. Fiction, History"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                  />

                </div>
                {errors.Genre &&
                  <p className="text-sm pl-1 text-red-700">{errors.Genre}</p>
                }
                <p className="mt-1.5 text-[11px] text-[#9a8e7f]">e.g. Fiction, Science, History</p>
              </div>
            </div>
          </div>
        </section>

        {/* Publication Details */}
        <section className="bg-[#fdfaea] rounded-xl border border-[#e8e0cc] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8d8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f5f0e0] border border-[#e8e0cc] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#7a6e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#3a2e1e]">Publication Details</h2>
                <p className="text-[11px] text-[#9a8e7f]">Publisher information and edition metadata</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#9a8e7f] bg-[#f5f0e0] border border-[#e8e0cc] px-2 py-0.5 rounded-full">2 of 4</span>
          </div>

          <div className="px-5 py-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  Publisher <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    name="Publisher"
                    value={handleform.Publisher}
                    onChange={formData}
                    type="text"
                    placeholder="e.g. Harcourt"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                  />

                </div>
                {errors.Publisher &&
                  <p className="text-sm pl-1 text-red-700">{errors.Publisher}</p>
                }
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  Year Published <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    name="Year"
                    value={handleform.Year}
                    onChange={formData}
                    type="number"
                    placeholder="e.g. 2024"
                    min={1000}

                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                  />

                </div>
                {errors.Year &&
                  <p className="text-sm pl-1 text-red-700">{errors.Year}</p>
                }
                <p className="mt-1.5 text-[11px] text-[#9a8e7f]">Between 1000–2026</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  Language <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <input
                    name="Language"
                    value={handleform.Language}
                    onChange={formData}
                    placeholder="e.g. English, Urdu"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                  />

                </div>
                {errors.Language &&
                  <p className="text-sm pl-1 text-red-700">{errors.Language}</p>
                }
                <p className="mt-1.5 text-[11px] text-[#9a8e7f]">Primary language of the book</p>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section className="bg-[#fdfaea] rounded-xl border border-[#e8e0cc] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8d8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f5f0e0] border border-[#e8e0cc] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#7a6e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#3a2e1e]">Inventory</h2>
                <p className="text-[11px] text-[#9a8e7f]">Physical stock management</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#9a8e7f] bg-[#f5f0e0] border border-[#e8e0cc] px-2 py-0.5 rounded-full">3 of 4</span>
          </div>

          <div className="px-5 py-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  Number of Copies <span className="text-red-700">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#b5a898]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="Copy"
                    value={handleform.Copy}
                    onChange={formData}

                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors"
                  />

                </div>
                {errors.Copy &&
                  <p className="text-sm pl-1 text-red-700">{errors.Copy}</p>
                }
                <p className="mt-1.5 text-[11px] text-[#9a8e7f]">Total physical copies in stock</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
                  Pages <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="Pages"
                    value={handleform.Pages}
                    onChange={formData}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors appearance-none cursor-pointer" />
                  {errors.Pages &&
                    <p className="text-sm pl-1 text-red-700">{errors.Pages}</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="bg-[#fdfaea] rounded-xl border border-[#e8e0cc] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8d8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f5f0e0] border border-[#e8e0cc] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#7a6e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#3a2e1e]">Description</h2>
                <p className="text-[11px] text-[#9a8e7f]">Book synopsis and summary</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#9a8e7f] bg-[#f5f0e0] border border-[#e8e0cc] px-2 py-0.5 rounded-full">4 of 4</span>
          </div>

          <div className="px-5 py-5">

            <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
              Synopsis <span className="text-red-700">*</span>
            </label>
            {errors.Description &&
              <p className="text-sm pl-1 text-red-700">{errors.Description}</p>
            }
            <textarea
              rows={5}

              name="Description"
              value={handleform.Description}
              onChange={formData}
              placeholder="A brief description of the book's content, themes, and audience..."
              className="w-full px-4 py-3 rounded-lg border border-[#d4c9b0] text-sm text-[#3a2e1e] placeholder-[#c5bbb0] bg-[#fdfaea] outline-none focus:ring-2 focus:ring-[#d4c9b0] focus:border-[#a89880] transition-colors resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className="text-[11px] text-[#9a8e7f]">{handleform.Description.length}/1000</span>
            </div>

          </div>
        </section>
        {/* Image */}
        <section className="bg-[#fdfaea] rounded-xl border border-[#e8e0cc] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8d8] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#f5f0e0] border border-[#e8e0cc] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#7a6e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#3a2e1e]">Book Media</h2>
            </div>
          </div>

          <div className="px-5 py-5">
            <label className="block text-[11px] font-semibold text-[#5c4f3a] uppercase tracking-wider mb-1.5">
              Book Cover Image<span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="book-upload"
                accept="image/*"
                onChange={imageHandler}
                className="hidden"

              />
              <label
                htmlFor="book-upload"
                className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-[#d4c9b0] bg-[#fdfaea] hover:border-[#864c25] hover:bg-[#fffcf0] transition-all cursor-pointer overflow-hidden"
              >{(fileName ? fileName : handleform.ImageURL) || `Choose File`}</label>
              {imageError &&
                <p className="text-sm pl-1 text-red-700">{imageError}</p>
              }
            </div>
          </div>
        </section>
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={cancel}
            className="px-5 py-2.5 rounded-lg border border-[#d4c9b0] bg-[#fdfaea] text-sm font-medium text-[#5c4f3a] hover:bg-[#f5f0e0] transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Discard Changes
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg bg-[#54552b] text-sm font-medium text-[#f5f0e0] hover:bg-[#3a2e1e] transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {submitting ? `Updating....` : `Save Changes`}
          </button>
        </div>
      </form>
      {alert && <Stack spacing={2} className="fixed top-17 right-15 w-100 z-1000">
        <Alert sx={{ backgroundColor: "#54552b", color:"#fdfdef" }} severity="error">{alert}</Alert>
      </Stack>}
    </div>
  );
}