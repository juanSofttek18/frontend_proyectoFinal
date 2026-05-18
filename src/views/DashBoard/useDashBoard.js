import { useState, useEffect } from "react";

function useDashBoard() {
    const [data, setData] = useState({total: 0, approved: 0, denied: 0});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const timer=setTimeout(() => {
            setData({ total: 24, approved: 16, denied: 6 });
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading };
}   

export default useDashBoard;