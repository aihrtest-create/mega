import React, { useEffect, useMemo } from "react";
import { Presentation } from "./Presentation";
import { WizardProvider, useWizard } from "./components/wizard-context";
import { StepIndicator } from "./components/step-indicator";
import { Step1Format } from "./components/step1-format";
import { Step1FormatV2 } from "./components/step1-format-v2";
import { Step2Quests } from "./components/step2-quests";
import { Step2Quests as Step2QuestsExperiment } from "./components/step2-quests-experiment";
import { Step2Location } from "./components/step2-location";
import { Step3Animators } from "./components/step3-animators";
import { Step3AdultLocation } from "./components/step3-adult-location";
import { Step4MasterClasses } from "./components/step4-masterclasses";
import { Step5Food } from "./components/step5-food";
import { Step6DateTime } from "./components/step6-datetime";
import { Step7Summary } from "./components/step7-summary";
import { Step11Included } from "./components/step11-included";
import { StepShows } from "./components/step-shows";
import { StepCakes } from "./components/step-cakes";

import { StepDisco } from "./components/step-disco";
import { StepBalloon } from "./components/step-balloon";
import { StepAdditionalActivities } from "./components/step-additional-activities";
import { StepAdditionalServices } from "./components/step-additional-services";
import { FloatingPrice } from "./components/floating-price";
import { AnimatePresence, motion } from "motion/react";
import HParkLogo from "../imports/HParkLogo";
import { AlertTriangle, RotateCcw, PlayCircle, RefreshCw } from "lucide-react";

// ──────────────────────────────────────────────
// Error Boundary — prevents white screen crashes
// ──────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WizardErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[WizardErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    // Clear all wizard caches from localStorage
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("wizard_cache_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore localStorage errors
    }
    // Reload the page for a fresh start
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-xl text-center border border-[#E5E5E5]">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
              Что-то пошло не так
            </h2>
            <p className="text-sm text-[#747474] mb-6 leading-relaxed">
              Произошла ошибка при загрузке конфигуратора. Нажмите кнопку ниже, чтобы начать заново.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-full bg-[#FF6022] text-white font-bold shadow-lg shadow-[#FF6022]/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Начать заново
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ──────────────────────────────────────────────
// Resume Banner — "Continue or Start Over" modal
// ──────────────────────────────────────────────
function ResumeBanner() {
  const { showResumeBanner, confirmResume, confirmRestart } = useWizard();

  if (!showResumeBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl"
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #FF6022, #FF8A50)" }}
          >
            <span className="text-2xl">🎉</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-[#1A1A1A] mb-2">
            С возвращением!
          </h3>
          <p className="text-sm text-center text-[#747474] mb-6 leading-relaxed">
            У вас есть незавершённый праздник. Хотите продолжить с того места, где остановились?
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={confirmResume}
              className="w-full py-3.5 rounded-full bg-[#FF6022] text-white font-bold shadow-lg shadow-[#FF6022]/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Продолжить
            </button>
            <button
              onClick={confirmRestart}
              className="w-full py-3.5 rounded-full bg-[#F5F5F5] text-[#747474] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#E5E5E5]"
            >
              <RefreshCw className="w-4 h-4" />
              Начать заново
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function WizardContent() {
  const { step, isMega } = useWizard();
  const useV2 = useMemo(() => !new URLSearchParams(window.location.search).has("nov2"), []);
  const useExp = useMemo(() => !new URLSearchParams(window.location.search).has("noexp"), []);

  useEffect(() => {
    // Scroll intentionally removed from here to prevent abrupt layout jumping
    // while animations are playing. Will happen during Transition onExitComplete.
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step6DateTime key="step1" />;
      case 2: return !isMega && useV2 ? <Step1FormatV2 key="step2v2" /> : <Step1Format key="step2" />;
      case 3: return useExp ? <Step2QuestsExperiment key="step3exp" /> : <Step2Quests key="step3" />;
      case 4: return <Step3Animators key="step4" />;
      case 5: return isMega ? null : <Step2Location key="step5" />;
      case 6: return <Step3AdultLocation key="step6" />;
      case 7: return <StepShows key="step7" />;
      case 8: return <Step4MasterClasses key="step8" />;
      case 9: return <Step5Food key="step9" />;
      case 10: return isMega ? null : <StepCakes key="step10" />;
      case 11: return <Step11Included key="step11" />;
      case 12: return <Step7Summary key="step12" />;
      case 13: return <StepDisco key="step13" />;
      case 14: return <StepBalloon key="step14" />;
      case 15: return <StepAdditionalActivities key="step15" />;
      case 16: return <StepAdditionalServices key="step16" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Resume Banner */}
      <ResumeBanner />

      {/* Header — hide on welcome */}
      {step > 0 && (
        <div className="sticky top-3 z-40 max-w-lg mx-auto px-4 pointer-events-none">
          <div className="bg-white/65 backdrop-blur-[40px] saturate-[180%] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border-[1.5px] border-white/85 pointer-events-auto overflow-hidden" style={{boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)'}}>
            <StepIndicator />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-lg mx-auto py-4 pb-14 overflow-x-hidden">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}>
          {renderStep()}
        </AnimatePresence>
      </main>

      {/* Floating price bar — hide on welcome */}
      {step > 0 && <FloatingPrice />}
    </div>
  );
}

export default function App() {
  const isPresentation = window.location.pathname === '/presentation' || window.location.pathname === '/mega/presentation';

  if (isPresentation) {
    return <Presentation />;
  }

  return (
    <WizardProvider>
      <WizardErrorBoundary>
        <WizardContent />
      </WizardErrorBoundary>
    </WizardProvider>
  );
}
