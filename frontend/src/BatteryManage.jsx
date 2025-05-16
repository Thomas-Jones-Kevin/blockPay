import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { useLocation } from "react-router-dom";

const BatteryManage = () => {
    const location = useLocation();
    const email = location.state?.email || "User";
    const [batteryLevel, setBatteryLevel] = useState(45);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const charging = true;

    const handleToggle = () => {
        const ele = document.getElementById("toggleMode");
        ele.innerHTML = ele.innerHTML === "Performance" ? "Power Saver" : "Performance";
    };

    useEffect(() => {
        console.log(email);
        // Remove default margin + padding of body
        document.body.style.margin = 0;
        document.body.style.padding = 0;
    }, []);

    useEffect(() => {
        if (charging) {
            document.getElementById("charging").innerHTML = "Charging...";
        }
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");

        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"],
                datasets: [
                    {
                        label: "Battery Usage",
                        data: [100, 90, 80, 60, 50, 40],
                        borderColor: "#facc15",
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#facc15",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });

        return () => chartInstance.current.destroy();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Battery Management</h1>

            <div style={styles.batteryContainer}>
                <div
                    style={{
                        ...styles.batteryBar,
                        width: `${batteryLevel}%`,
                        backgroundColor:
                            batteryLevel > 50 ? "#22c55e" : batteryLevel > 20 ? "#facc15" : "#ef4444",
                    }}
                ></div>
                <span style={styles.batteryText}>{batteryLevel}%</span>
            </div>

            <div style={styles.chartContainer}>
                <canvas ref={chartRef} />
            </div>

            <div style={{ marginTop: "20px" }}>
                <label style={styles.label}>Mode: </label>
                <button id="toggleMode" onClick={handleToggle} style={styles.button}>
                    Performance
                </button>
            </div>

            <h3 style={styles.estimate}>Estimated Time: 2hrs</h3>

            <div>
                <label style={styles.label}>Status: </label>
                <span id="charging" style={styles.status}></span>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#0f172a", // dark blue-green
        color: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        minHeight: "100vh",
        padding: "20px",
    },
    heading: {
        fontSize: "3rem",
        fontWeight: "bold",
        color: "#38bdf8",
        marginBottom: "30px",
    },
    batteryContainer: {
        width: "80%",
        height: "100px",
        backgroundColor: "#1e293b",
        borderRadius: "20px",
        position: "relative",
        margin: "auto",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    },
    batteryBar: {
        height: "100%",
        position: "absolute",
        left: "0",
        top: "0",
        transition: "width 0.6s ease-in-out",
        borderRadius: "20px 0 0 20px",
    },
    batteryText: {
        position: "relative",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "white",
        lineHeight: "100px",
    },
    chartContainer: {
        marginTop: "50px",
        height: "300px",
    },
    label: {
        fontSize: "1.2rem",
        color: "#e2e8f0",
    },
    button: {
        marginLeft: "10px",
        padding: "8px 20px",
        backgroundColor: "#38bdf8",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "0.3s",
    },
    estimate: {
        marginTop: "20px",
        color: "#facc15",
    },
    status: {
        fontSize: "1.2rem",
        color: "#22c55e",
        fontWeight: "bold",
    },
};

export default BatteryManage;
