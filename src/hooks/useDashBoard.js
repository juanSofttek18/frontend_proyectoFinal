import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/solicitudService";

function useDashBoard() {
    const [data, setData] = useState({
        totalRequests: 0,
        approvedRequests: 0,
        deniedRequests: 0,
        pendingRequests: 0,
        totalCustomers: 0,
        totalVehicles: 0,
        availableVehicles: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchStats = async () => {
            try {
                setLoading(true);
                const stats = await getDashboardStats();
                if (isMounted) {
                    setData(stats);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                if (isMounted) {
                    setError(err.message || "Error al cargar estadísticas");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
}   

export default useDashBoard;