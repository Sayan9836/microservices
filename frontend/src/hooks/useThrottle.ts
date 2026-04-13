import { useEffect, useRef, useState } from "react"


export const useThrottle = <T>(value:T, delay = 300): T => {
    const [throttleValue, setThrottleValue] = useState<T>(value);
    const lastRan = useRef(0);

    useEffect(() => {

        if (lastRan.current === 0) {
            lastRan.current = Date.now();
        }

        const handler = setTimeout(() => {
            setThrottleValue(value);
            lastRan.current = Date.now();
        }, delay - (Date.now() - lastRan.current))

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return throttleValue;

}