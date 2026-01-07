import { Mail, MapPin } from "lucide-react";
export const metadata = {
  title: "Contact Us | APPNA NC 2026 – Connect with Our Chapter",
  description:
    "Get in touch with APPNA North Carolina for questions, collaborations, or support. Our 2026 focus on community, mentorship, and physician wellness ensures your message is heard and valued.",
};

export default function ContactUs() {
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
            Reach out to APPNA North Carolina — we’re here to help and
            support our community.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left – Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Email
              </h3>
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
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Location
              </h3>
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
          <form className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sm:p-8 space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">
                Full Name
              </label>
              <input
                type="text"
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
                placeholder="Write your message..."
                className="w-full rounded-lg border border-green-200 px-4 py-2.5
                  focus:outline-none focus:ring-2 focus:ring-green-700/30 resize-none"
              />
            </div>

            <button
              type="submit"
              className="
                w-full rounded-lg bg-green-900 text-white py-3
                font-medium tracking-wide
                hover:bg-green-800 transition
              "
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
