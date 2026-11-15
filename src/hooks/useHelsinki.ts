import { useEffect, useMemo, useState } from "react";
import { computeHelsinkiSolar } from "../lib/helsinkiSolar";

/** Helsinki's clock and sun, recomputed twice a minute. */
export function useHelsinki() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => computeHelsinkiSolar(now), [now]);
}
