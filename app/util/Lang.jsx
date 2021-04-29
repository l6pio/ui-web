import {useEffect, useRef} from "react";

export const isEmpty = v => {
    return v === undefined || v == null || v === "" ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === "object" && Object.keys(v).length === 0);
};

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        let id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, []);
};
