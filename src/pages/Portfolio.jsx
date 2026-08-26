import React, { Suspense, lazy } from "react";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works } from "../components";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";
import ErrorBoundary from "../components/ErrorBoundary";

const StarsCanvas = lazy(() =>
  import("../components/canvas/Stars").then((mod) => ({ default: mod.default }))
);

const Portfolio = () => {
  return (
    <SiteSettingsProvider>
      <div className="relative z-0 bg-primary w-full overflow-hidden">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className="relative z-0">
          <Contact />
          <ErrorBoundary message="Arka plan animasyonu yüklenemedi.">
            <Suspense fallback={null}>
              <StarsCanvas />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </SiteSettingsProvider>
  );
};

export default Portfolio;
