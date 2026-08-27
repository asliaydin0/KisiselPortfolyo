import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Services, Tech, Works } from "../components";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";
import ErrorBoundary from "../components/ErrorBoundary";

const StarsCanvas = lazy(() =>
  import("../components/canvas/Stars").then((mod) => ({ default: mod.default }))
);

const LazyStars = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 z-[-1] pointer-events-none">
      {visible && (
        <ErrorBoundary message="Arka plan animasyonu yüklenemedi.">
          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};

const Portfolio = () => {
  return (
    <SiteSettingsProvider>
      <div className="relative z-0 bg-primary w-full overflow-hidden">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Services />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className="relative z-0">
          <Contact />
          <LazyStars />
        </div>
      </div>
    </SiteSettingsProvider>
  );
};

export default Portfolio;
