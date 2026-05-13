"use client";

import { useState } from "react";
import { Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.subject || !form.message) {
      setErrorMsg("Please fill in all fields before submitting.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "Something went wrong.");
      }

      setStatus("success");
      setForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg(err.message ?? "Failed to send message. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="relative bg-[#f8f9fb] py-10">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Contact Us
          </h2>
          <p className="mt-4 text-gray-600">
            Have a question, collaboration idea, or need assistance?
            Reach out to APPNA North Carolina — we&apos;re here to help and
            support our community.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left – Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Email</h3>
              <div className="flex items-center gap-3 text-green-800">
                <Mail size={20} />
                <a
                  href="mailto:appnanc@gmail.com"
                  className="hover:text-green-900 transition"
                >
                  appnanc@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Location</h3>
              <div className="flex items-center gap-3 text-green-800">
                <MapPin size={20} />
                <span>North Carolina, United States</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 max-w-md">
              We typically respond within 24–48 hours. Your message is
              important to us and will be handled with care.
            </p>
          </div>

          {/* Right – Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sm:p-8 space-y-5">

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <CheckCircle className="w-14 h-14 text-green-600" />
                <h3 className="text-xl font-semibold text-green-900">Message Sent!</h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Thank you for reaching out. We&apos;ve sent a confirmation to your
                  email and will be in touch within 24–48 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-sm font-medium text-[#7a1f3d] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-green-200 px-4 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-green-700/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-green-200 px-4 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-green-700/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-green-200 px-4 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-green-700/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="w-full rounded-lg border border-green-200 px-4 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-green-700/30 resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="
                    w-full rounded-lg bg-green-900 text-white py-3
                    font-medium tracking-wide
                    hover:bg-green-800 transition
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}