import { Check } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07140e] text-white">
      <div className="px-6 sm:px-10 md:px-24 py-14">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          
          {/* Column 1 – About / Membership */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide mb-5">
              APPNA North Carolina
            </h3>
            <p className="text-green-100 text-sm leading-relaxed">
              APPNA – North Carolina is a professional, educational, and
              not-for-profit organization serving physicians of Pakistani descent.
              Active members enjoy full voting rights and leadership opportunities
              in accordance with the chapter bylaws.
            </p>
          </div>

          {/* Column 2 – Organization Values */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide mb-5">
              Organization
            </h3>
            <ul className="space-y-3">
              {[
                "Independent & Not-for-Profit",
                "Professional & Educational",
                "Non-Political Organization",
                "Physician-Led Membership",
                "Community-Focused Service",
                "Charitable Initiatives",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className="text-green-400 mt-0.5 shrink-0"
                  />
                  <span className="text-green-100 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Contact */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-green-300 mb-1">Phone</p>
                <a
                  href="tel:+1343323243"
                  className="text-white font-medium hover:text-green-300 transition"
                >
                  +1 (343) 323-243
                </a>
              </div>

              <div>
                <p className="text-green-300 mb-1">Email</p>
                <a
                  href="mailto:info@appnanc.org"
                  className="text-white font-medium hover:text-green-300 transition break-all"
                >
                  support@appnanc.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-6">
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-green-200">
              © 2026 APPNA North Carolina. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-green-200">
              <a
                href="/privacy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-white transition"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
