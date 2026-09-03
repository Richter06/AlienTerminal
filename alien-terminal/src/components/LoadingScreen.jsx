import { useEffect, useState } from "react";

const loadingSteps = [
  "INITIALIZING SHIPBOARD SYSTEM...",
  "LOADING CORE SYSTEMS...",
  "CHECKING NAVIGATION...",
  "CALIBRATING MOTION SENSORS...",
  "INITIALIZING DOOR CONTROL...",
  "ESTABLISHING TERMINAL...",
  "SYSTEM READY",
];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 30;
    const totalIntervals = duration / intervalTime;

    let currentInterval = 0;

    const interval = setInterval(() => {
      currentInterval++;

      const nextProgress = Math.min(
        Math.round(
          (currentInterval / totalIntervals) * 100
        ),
        100
      );

      setProgress(nextProgress);

      const nextStep = Math.min(
        Math.floor(nextProgress / 15),
        loadingSteps.length - 1
      );

      setStep(nextStep);

      if (nextProgress >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <section className="loading-screen">
      <div className="loading-content">
        <div className="loading-header">
          USCSS SYSTEMS — SHIPBOARD TERMINAL
        </div>

        <div className="loading-status">
          {loadingSteps[step]}
        </div>

        <div className="loading-bar">
          <div
            className="loading-bar-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="loading-progress">
          {progress}%
        </div>
      </div>
    </section>
  );
}