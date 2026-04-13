import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { ProblemStats } from "@/components/landing/ProblemStats";
import { FiveAttributes } from "@/components/landing/FiveAttributes";
import { WorkflowDiagram } from "@/components/landing/WorkflowDiagram";
import { HumanInCenter } from "@/components/landing/HumanInCenter";
import { Roadmap } from "@/components/landing/Roadmap";
import { FuturePhases } from "@/components/landing/FuturePhases";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div id="problem">
          <ProblemStats />
        </div>
        <FiveAttributes />
        <WorkflowDiagram />
        <HumanInCenter />
        <Roadmap />
        <FuturePhases />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
