import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function useLiveMetric(base, variance = 5) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setValue(base + Math.floor((Math.random() - 0.5) * variance));
    }, 4000);
    return () => clearInterval(id);
  }, [base, variance]);
  return value;
}
