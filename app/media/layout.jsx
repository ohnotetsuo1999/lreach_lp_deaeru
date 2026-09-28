import { Outfit } from "next/font/google";
import DeaeruHeader from "@/components/deaeru/DeaeruHeader";
import DeaeruFooter from "@/components/deaeru/DeaeruFooter";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-outfit-deaeru",
});

export default function DeaeruArticlesLayout({ children }) {
  return (
    <div className={`min-h-screen bg-white ${outfit.variable}`}>
      <DeaeruHeader />
      <main role="main">{children}</main>
      <DeaeruFooter />
    </div>
  );
}
