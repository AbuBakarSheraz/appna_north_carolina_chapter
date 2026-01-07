import {
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07140e] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
        
        {/* Main Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left – Brand */}
          <p className="text-sm tracking-wide text-green-200">
            © 2026 APPNA North Carolina
          </p>

          {/* Center – Navigation */}
          <nav className="flex gap-6 text-sm text-green-200">
            <a href="/" className="hover:text-white transition">
              Home
            </a>
            <a href="/donate" className="hover:text-white transition">
              Donate
            </a>
            <a href="/join" className="hover:text-white transition">
              Join
            </a>
            <a href="/contact_us" className="hover:text-white transition">
              Contact
            </a>
          </nav>

          {/* Right – Contact & Social */}
          <div className="flex items-center gap-5">
            
            {/* Contact */}
            <a
              href="mailto:support@appnanc.org"
              className="text-green-200 hover:text-white transition"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>

            <a
              href="tel:+1343323243"
              className="text-green-200 hover:text-white transition"
              aria-label="Phone"
            >
              <Phone size={18} />
            </a>

            {/* Social */}
            <a
              href="https://www.facebook.com/APPNANorthCarolina/"
              className="text-green-200 hover:text-white transition"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>

            <a
              href="#"
              className="text-green-200 hover:text-white transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="#"
              className="text-green-200 hover:text-white transition"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
