"use client";

import { useState } from "react";
import { Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Section from "../../../components/shared/Section";

// Edit these two lines to restyle every form field
const labelClass = "mb-1 block text-sm font-medium text-ink";
const inputClass = "w-full rounded-lg border border-line bg-card px-4 py-2.5 text-ink focus:border-grove focus:outline-none focus:ring-2 focus:ring-grove/30";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

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
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Have a question, collaboration idea, or need assistance? Reach out to APPNA North Carolina — we’re here to help and support our community."
      />

      <Section flushTop>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-grove-soft text-grove">
                <Mail size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-grove-dark">Email</h3>
                <a href="mailto:appnanc@gmail.com" className="text-ink-soft transition hover:text-grove">appnanc@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-grove-soft text-grove">
                <MapPin size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-grove-dark">Location</h3>
                <p className="text-ink-soft">North Carolina, United States</p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-ink-soft">
              We typically respond within 24–48 hours. Your message is important to us and will be handled with care.
            </p>
          </div>

          {/* Right: contact form */}
          <div className="rounded-xl border border-line bg-card p-6 shadow-sm sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <CheckCircle className="h-14 w-14 text-grove" aria-hidden="true" />
                <h3 className="font-display text-2xl font-medium text-grove-dark">Message Sent!</h3>
                <p className="max-w-xs text-sm leading-6 text-ink-soft">
                  Thank you for reaching out. We’ve sent a confirmation to your email and will be in touch within 24–48 hours.
                </p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-2 text-sm font-semibold uppercase tracking-wide text-grove hover:text-grove-dark">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="fullName" className={labelClass}>Full Name</label>
                  <input id="fullName" type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your name" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <input id="subject" type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea id="message" rows={4} name="message" value={form.message} onChange={handleChange} placeholder="Write your message..." className={`${inputClass} resize-none`} />
                </div>

                {status === "error" ? (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-grove py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-grove-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}