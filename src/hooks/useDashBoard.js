import { useState, useEffect } from "react";

function useDashBoard() {
    const [data, setData] = useState({total: 0, approved: 0, denied: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const timer=setTimeout(() => {
            setData({ total: 24, approved: 16, denied: 6 });
            setLoading(false);
            setError(null); 
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading, error };
}   

export default useDashBoard;