
import { useState, useEffect } from "react";

interface UseTimerProps {
  initialTime: number;
  onComplete?: () => void;
}

export const useTimer = ({ initialTime, onComplete }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: number;
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && onComplete) {
      onComplete();
    }
    return () => {
      clearInterval(timer);
    };
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = (newTime = initialTime) => {
    setTimeLeft(newTime);
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return { 
    timeLeft,
    isActive, 
    toggleTimer, 
    resetTimer,
    formattedTime: formatTime(timeLeft)
  };
};
