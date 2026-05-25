import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { V3Provider, useV3 } from "./state";
import { ScreenDateTime } from "./screens/ScreenDateTime";
import { ScreenPackage } from "./screens/ScreenPackage";
import { ScreenCustomize } from "./screens/ScreenCustomize";
import { ScreenIndividual } from "./screens/ScreenIndividual";
import { ScreenSummary } from "./screens/ScreenSummary";

function Switcher() {
  const { screen } = useV3();

  const renderScreen = () => {
    switch (screen) {
      case "datetime":   return <ScreenDateTime key="datetime" />;
      case "package":    return <ScreenPackage key="package" />;
      case "customize":  return <ScreenCustomize key="customize" />;
      case "individual": return <ScreenIndividual key="individual" />;
      case "summary":    return <ScreenSummary key="summary" />;
      default:           return null;
    }
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}
    >
      <motion.div
        key={screen}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}

export function V3App() {
  return (
    <V3Provider>
      <Switcher />
    </V3Provider>
  );
}

export default V3App;
