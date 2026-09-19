import type { Metadata } from "next";
import { Montserrat, Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Typographies officielles Nekama : Montserrat (titres) & Inter (texte)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEKAMA — Le réseau social des otakus",
  description:
    "Plus qu'un réseau social, une communauté. L'espace ultime pensé pour les otakus.",
  keywords: "otaku, anime, manga, réseau social, communauté, pwa, nekama",
  openGraph: {
    title: "NEKAMA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={cn("dark", montserrat.variable, inter.variable, notoJp.variable)}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
