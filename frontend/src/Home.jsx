import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Home() {

    const location = useLocation();
    const email = location.state?.email || "User";

    useEffect(() => {
        document.body.style.margin = 0;
        document.body.style.padding = 0;
    }, []);

    return (
        <div style={styles.container}>
            {/* Sidebar Navigation */}
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>Menu</h2>
                <Link to='/BatteryManage' state={{ email }} style={styles.navLink}>Battery</Link>
                <Link to='/BudgetManage' state={{ email }} style={styles.navLink}>Budget</Link>
                <Link to='/Transaction' state={{ email }} style={styles.navLink}>Transaction</Link>
                <Link to='/BlockchainVisualizer' state={{email}} style={styles.navLink}>Blockchain Visualizer</Link>
                <Link to='/UserDetails' state={{ email }} style={styles.navLink}>Details</Link>
                <Link to='/Login' style={styles.signOut}>Sign Out</Link>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <h1 style={styles.heading}>Welcome, {email}</h1>
                <p style={styles.description}>
                    This is your central dashboard where you can monitor and manage all aspects of your IoT device ecosystem.
                    Navigate through battery status, budget tracking, transaction history, device statistics, and user details easily.
                </p>

                <div style={styles.cardContainer}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Battery Management</h3>
                        <p style={styles.cardInfo}>Monitor battery health & usage</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Budget Control</h3>
                        <p style={styles.cardInfo}>Set & track spending limits</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Transactions</h3>
                        <p style={styles.cardInfo}>View your payment history</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#0f172a",
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
    },
    sidebar: {
        width: "250px",
        backgroundColor: "#1e293b",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.2)",
    },
    sidebarTitle: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#3b82f6",
    },
    navLink: {
        textDecoration: "none",
        color: "white",
        fontSize: "18px",
        padding: "10px",
        width: "100%",
        textAlign: "center",
        borderRadius: "5px",
        transition: "background 0.3s",
        marginBottom: "10px",
        backgroundColor: "#334155",
    },
    signOut: {
        textDecoration: "none",
        color: "white",
        fontSize: "18px",
        padding: "10px",
        width: "100%",
        textAlign: "center",
        borderRadius: "5px",
        transition: "background 0.3s",
        marginTop: "auto",
        backgroundColor: "#ef4444",
    },
    mainContent: {
        flex: 1,
        padding: "40px",
        textAlign: "center",
    },
    heading: {
        fontSize: "32px",
        color: "#e2e8f0",
        marginBottom: "20px",
    },
    description: {
        fontSize: "18px",
        color: "#cbd5e1",
        lineHeight: "1.5",
        maxWidth: "800px",
        margin: "0 auto 30px auto",
    },
    cardContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
    },
    card: {
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "200px",
        textAlign: "center",
    },
    cardTitle: {
        fontSize: "20px",
        color: "#3b82f6",
        marginBottom: "10px",
    },
    cardInfo: {
        fontSize: "16px",
        color: "#22c55e",
    },
};

export default Home;
