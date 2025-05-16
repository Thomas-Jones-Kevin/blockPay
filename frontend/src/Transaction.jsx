import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Transaction() {
    const location = useLocation();
    const email = location.state?.email || "User";
    console.log(email);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(null);
    const [filterType, setFilterType] = useState("");
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        document.body.style.margin = 0;
        document.body.style.padding = 0;
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await axios.post('http://127.0.0.1:3001/getAmt', { email });
                console.log("Balance:", res.data);
                setBalance(res.data);
            } catch (err) {
                console.error("Error fetching balance:", err);
            }
        };
    
        fetchBalance();
    }, []);
    

    useEffect(() => {
        axios.post(`http://127.0.0.1:3001/transactions/`,{email})
            .then(response => {
                console.log(response.data);
                setTransactions(response.data);
            })
            .catch(error => {
                console.error("Error fetching transaction data:", error);
            });
    }, [email]);

    const filteredTransactions = transactions.filter((tx) => {
        const matchesType = filterType ? tx.transactionType === filterType : true;
        const matchesDate = filterDate ? new Date(tx.timestamp).toLocaleDateString() === filterDate : true;
        return matchesType && matchesDate;
    });

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Account Balance</h2>
            {balance && (
                <div style={styles.balanceContainer}>
                    <p style={styles.amount}>{balance}</p>
                </div>
            )}

            <h2 style={styles.heading}>Transaction History</h2>


            {filteredTransactions.length === 0 ? (
                <p style={styles.noTransaction}>No transactions found.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>QR Data</th>
                            <th style={styles.th}>receiver</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>amount</th>
                            <th style={styles.th}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx, index) => (
                            <tr key={index} style={styles.tr}>
                                <td style={styles.td}>{tx.qrData}</td>
                                <td style={styles.td}>{tx.receiver}</td>
                                <td style={styles.td}>{tx.status}</td>
                                <td style={styles.td}>{tx.amount}</td>
                                <td style={styles.td}>{new Date(tx.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "#0a1128",
        minHeight: "100vh",
        color: "#e0e0e0",
    },
    heading: {
        fontSize: "26px",
        marginBottom: "12px",
        color: "#00b4d8",
    },
    balanceContainer: {
        background: "#1a1a2e",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 180, 216, 0.2)",
        width: "300px",
        margin: "0 auto",
    },
    amount: {
        fontSize: "34px",
        fontWeight: "bold",
        color: "#ffffff",
    },
    filters: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "20px",
    },
    input: {
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #00b4d8",
        backgroundColor: "#16213e",
        color: "#ffffff",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        background: "#1a1a2e",
        borderRadius: "10px",
        overflow: "hidden",
    },
    th: {
        background: "#0f3460",
        color: "#ffffff",
        padding: "12px",
        textAlign: "left",
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #282828",
        textAlign: "left",
        color: "#e0e0e0",
    },
    tr: {
        backgroundColor: "#16213e",
    },
    noTransaction: {
        fontSize: "18px",
        color: "#8899aa",
    },
};

export default Transaction;
