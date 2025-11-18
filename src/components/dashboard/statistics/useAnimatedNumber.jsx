import { useState, useEffect, useRef } from "react";

const useAnimatedNumber = (value, duration = 500) => {
    const [display, setDisplay] = useState(value ?? 0);
    const rafRef = useRef(null);
    const startRef = useRef(null);
    const fromRef = useRef(display);

    useEffect(() => {
        const start = performance.now();
        const from = fromRef.current ?? value ?? 0;
        const to = value ?? 0;
        const diff = to - from;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const step = (ts) => {
            const t = Math.min(1, (ts - start) / duration);
            const eased = t < 0.5 ? (2 * t * t) : (-1 + (4 - 2 * t) * t); // easeInOutQuad-like
            setDisplay(from + diff * eased);
            if (t < 1) {
                rafRef.current = requestAnimationFrame(step);
            } else {
                fromRef.current = to;
            }
        };
        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [value, duration]);

    return display;
};

export { useAnimatedNumber };
