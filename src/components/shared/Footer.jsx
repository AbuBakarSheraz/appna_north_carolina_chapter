import { Facebook, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import Link from "next/link";
import { Reveal } from "../motion/Reveal";

export default function Footer() {
  return (
    <footer className="bg-grove-dark text-white">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-12 sm:px-6 md:flex-row lg:px-8">
        <div><p className="font-display text-2xl font-medium text-white sm:text-3xl">Connecting our chapter as a family.</p><p className="mt-2 text-sm leading-6 text-white/70">APPNA North Carolina</p></div>
        <div className="flex flex-wrap justify-center gap-3"><Link href="/donate" className="inline-flex items-center justify-center rounded-full bg-grove px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-grove-soft hover:text-grove-dark">Donate</Link><Link href="/register" className="inline-flex items-center justify-center rounded-full border border-white/35 px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10">Join Us</Link></div>
      </Reveal>
      <div className="border-t border-white/15"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-7 text-center text-xs text-white/70 sm:px-6 md:flex-row md:text-left lg:px-8"><div>© 2026 APPNA North Carolina</div><nav className="flex flex-wrap justify-center gap-4 md:justify-start" aria-label="Footer navigation"><Link href="/" className="transition hover:text-white">Home</Link><Link href="/donate" className="transition hover:text-white">Donate</Link><Link href="/join" className="transition hover:text-white">Join</Link><Link href="/contact_us" className="transition hover:text-white">Contact</Link></nav><div className="flex items-center gap-4"><a href="mailto:support@appnanc.org" className="transition hover:text-white" aria-label="Email"><Mail size={18} /></a><a href="tel:+1343323243" className="transition hover:text-white" aria-label="Phone"><Phone size={18} /></a><a href="https://www.facebook.com/APPNANorthCarolina/" target="_blank" rel="noopener noreferrer" className="transition hover:text-white" aria-label="Facebook"><Facebook size={18} /></a><a href="#" className="transition hover:text-white" aria-label="LinkedIn"><Linkedin size={18} /></a><a href="#" className="transition hover:text-white" aria-label="Twitter"><Twitter size={18} /></a></div></div></div>
      <div className="border-t border-white/10"><div className="mx-auto max-w-7xl px-5 py-4 text-center text-xs text-white/55 sm:px-6 lg:px-8">Developed &amp; maintained with ❤️ by <a href="https://www.linkedin.com/in/abubakar-sheraz-350085222" target="_blank" rel="noopener noreferrer" className="font-medium text-white/75 transition hover:text-white">Sheraz</a></div></div>
    </footer>
  );
}
