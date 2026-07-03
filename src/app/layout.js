import "./globals.css";
import '../lib/interceptors';

export const metadata = {
  title: "APPNA North Carolina | Healthcare & Community",
  description:
    "APPNA North Carolina Chapter is a non-profit organization dedicated to connecting physicians as a family, promoting health and wellness, fostering mentorship, and supporting current and future physicians through community engagement, professional collaboration, and meaningful social initiatives.",
  metadataBase: new URL("https://appnanc.org"),
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* <Header />
        <Announcement /> */}
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
