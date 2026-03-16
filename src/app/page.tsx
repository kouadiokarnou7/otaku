import Header from "@/components/sections/header";
import Hero     from "@/components/sections/hero";
import Features from "@/components/sections/features";
import About    from "@/components/sections/About";
import Gallery  from "@/components/sections/Gallery";
import Footer   from "@/components/sections/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <Header />
      <Hero     />
      <Features />
      <About    />
      <Gallery  />
      <Footer   />
    </main>
  );
}