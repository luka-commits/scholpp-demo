"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { DemoResetButton } from "@/components/shared/DemoResetButton";
import { ScenarioIntro } from "@/components/demo/ScenarioIntro";
import { InboxView } from "@/components/demo/InboxView";
import { AgentWorking } from "@/components/demo/AgentWorking";
import { ApprovalCard } from "@/components/demo/ApprovalCard";
import { ImpactScreen } from "@/components/demo/ImpactScreen";

type State = "intro" | "inbox" | "working" | "approval" | "impact";

export default function DemoPage() {
  const [state, setState] = useState<State>("intro");

  const reset = () => setState("intro");

  return (
    <>
      <Header showStatus />
      {state !== "intro" && <DemoResetButton onReset={reset} />}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {state === "intro" && <ScenarioIntro onDone={() => setState("inbox")} />}
            {state === "inbox" && <InboxView onStart={() => setState("working")} />}
            {state === "working" && <AgentWorking onDone={() => setState("approval")} />}
            {state === "approval" && (
              <ApprovalCard onApprove={() => setState("impact")} />
            )}
            {state === "impact" && <ImpactScreen onReset={reset} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
