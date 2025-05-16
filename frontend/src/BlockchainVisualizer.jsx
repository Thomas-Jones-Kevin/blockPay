import React, { useEffect, useState } from "react";
import axios from "axios";

const BlockchainVisualizer = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
          document.body.style.margin = 0;
          document.body.style.padding = 0;
      }, []);

      useEffect(() => {
        const fetchBlockchain = async () => {
          try {
            console.log("📡 Sending POST request to /blockchain...");
            const response = await axios.post("http://localhost:3001/blockchain");
            console.log("✅ Blockchain response:", response.data);
      
            setBlocks(response.data.chain.reverse());
          } catch (err) {
            console.error("❌ Error fetching blockchain:", err);
            if (err.response) {
              console.error("📦 Server responded with:", err.response.status, err.response.data);
            } else {
              console.error("🌐 Network or CORS issue");
            }
          }
        };
      
        fetchBlockchain();
      }, []);
      

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📦 Blockchain Visualizer</h1>
      <div style={styles.blockContainer}>
        {blocks.map((block, index) => (
          <div key={index} style={styles.blockCard}>
            <h3 style={styles.blockTitle}>Block #{block.index}</h3>
            <p><strong>Hash:</strong> {block.hash}</p>
            <p><strong>Prev Hash:</strong> {block.previousHash}</p>
            <p><strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}</p>
            <p><strong>Nonce:</strong> {block.nonce}</p>
            <div style={styles.txBox}>
              <h4>Transactions:</h4>
              {block.transactions.length === 0 ? (
                <p style={styles.empty}>No transactions</p>
              ) : (
                block.transactions.map((tx, idx) => (
                  <div key={idx} style={styles.tx}>
                    <p>💸 {tx.sender} → {tx.receiver}</p>
                    <p>Amount: ₹{tx.amount}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#4f46e5",
    fontSize: "32px",
    marginBottom: "20px",
  },
  blockContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  blockCard: {
    backgroundColor: "#1e293b",
    borderRadius: "10px",
    padding: "20px",
    width: "350px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  },
  blockTitle: {
    color: "#3b82f6",
    marginBottom: "10px",
  },
  txBox: {
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "10px",
  },
  tx: {
    backgroundColor: "#334155",
    padding: "8px",
    marginBottom: "6px",
    borderRadius: "5px",
  },
  empty: {
    color: "#94a3b8",
  },
};

export default BlockchainVisualizer;
