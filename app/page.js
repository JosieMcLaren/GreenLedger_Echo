import Navbar from "./ComponentHome/Navbar";
import Hero from "./ComponentHome/Hero";
import Features from "./ComponentHome/Features";
import Impact from "./ComponentHome/Impact";
import CtaBanner from "./ComponentHome/CtaBanner";
import Footer from "./ComponentHome/Footer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <Features />
      <Impact />
      <CtaBanner />
      <Footer />
    </main>
  );
}
