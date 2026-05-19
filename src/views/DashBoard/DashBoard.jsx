import useDashBoard from "./useDashBoard";
import "./DashBoard.css";

function DashBoard() {
    const { data, loading } = useDashBoard();

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="stats-container">
                    <div className="stat-card">
                        <h2>Total Requests</h2>
                        <p>{data.total}</p>
                    </div>
                    <div className="stat-card approved">
                        <h2>Approved Requests</h2>
                        <p>{data.approved}</p>
                    </div>
                    <div className="stat-card denied">
                        <h2>Denied Requests</h2>
                        <p>{data.denied}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashBoard;