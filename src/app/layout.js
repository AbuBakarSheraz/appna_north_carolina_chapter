import { Cormorant, DM_Sans } from "next/font/google";
import "./globals.css";
import "../lib/interceptors";
import PageTransition from "../components/motion/PageTransition";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "APPNA North Carolina | Healthcare & Community",
  description: "APPNA North Carolina Chapter is a non-profit organization dedicated to connecting physicians as a family, promoting health and wellness, fostering mentorship, and supporting current and future physicians through community engagement, professional collaboration, and meaningful social initiatives.",
  metadataBase: new URL("https://appnanc.org"),
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body><PageTransition>{children}</PageTransition></body>
    </html>
  );
}
