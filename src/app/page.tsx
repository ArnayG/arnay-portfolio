import BusinessCard from "@/components/BusinessCard";
import Container from "@/components/Container";
import Hero from "@/components/sections/Hero";
import Education from "@/components/sections/Education";
import Research from "@/components/sections/Research";
import Projects from "@/components/sections/Projects";
import Hobbies from "@/components/sections/Hobbies";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Container className="pt-10 pb-24">
        {/* Sticky lives on the aside via self-start — items-start on the grid
            would also un-stretch the content column. min-w-0 keeps a long
            unbroken string from blowing out the 1fr track. */}
        <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-16">
          <aside className="desk-tall:sticky desk-tall:top-20 desk-tall:self-start">
            <BusinessCard />
          </aside>

          <div className="min-w-0">
            <Hero />
            <Education />
            <Research />
            <Projects />
            <Hobbies />
          </div>
        </div>
      </Container>

      <section id="contact" className="invert-band dot-grid bg-paper text-ink">
        <Container className="py-24">
          <Contact />
        </Container>
      </section>
    </>
  );
}
