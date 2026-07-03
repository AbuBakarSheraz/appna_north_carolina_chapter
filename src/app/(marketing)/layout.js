import "../globals.css";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import Announcement from "../../components/Announcement";
import '../../lib/interceptors';

export const metadata = {
  title: "APPNA North Carolina | Healthcare & Community",
  description:
    "APPNA North Carolina Chapter is a non-profit organization dedicated to connecting physicians as a family, promoting health and wellness, fostering mentorship, and supporting current and future physicians through community engagement, professional collaboration, and meaningful social initiatives.",
  metadataBase: new URL("https://appnanc.org"),
};


export default function MarketingLayout({ children }) {
  return (
    <>
        <Header />
        <Announcement />
        <main>{children}</main>
        <Footer />
    </>
  );
}
