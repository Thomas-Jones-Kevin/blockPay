import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BudgetManage = () => {
  const location = useLocation();
  const email = location.state?.email || "User";

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [newBudget, setNewBudget] = useState("");
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    console.log("📧 Email from location:", email);
    document.body.style.margin = 0;
    document.body.style.padding = 0;

    const fetchSpent = async () => {
      try {
        const res = await axios.post("http://localhost:3001/spent", { email });
        console.log("✅ Spent fetched:", res.data.spent);
        setSpent(res.data.spent);
      } catch (err) {
        console.error("❌ Error fetching spent:", err);
      }
    };

    fetchSpent();
  }, [email]);

  useEffect(()=>{
    const fetchBudget = async() => {
      const res = await axios.post("http://localhost:3001/getBudget",{email});
      console.log(res);
      setMonthlyBudget(res.data);
    }
    fetchBudget()
  },[])

  const remainingBudget = monthlyBudget - spent;

  const handleBudgetUpdate = async() => {
    if (newBudget) {
      setMonthlyBudget(parseInt(newBudget));
      const res = await axios.post("http://localhost:3001/saveBudget",{email,budget:newBudget});
      console.log(res);
      setNewBudget("");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Budget Management</h1>

      <div style={styles.budgetBox}>
        <p style={styles.text}>Monthly Budget: ₹{monthlyBudget}</p>
        <input
          type="number"
          placeholder="Enter New Budget"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleBudgetUpdate} style={styles.button}>
          Set New Budget
        </button>
      </div>

      <h2 style={styles.subHeading}>Spending Overview</h2>
      <p style={styles.text}>Total Spent: ₹{spent}</p>

      <h2 style={styles.subHeading}>Remaining Budget</h2>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progress,
            width: `${(spent / monthlyBudget) * 100}%`,
            backgroundColor: spent > monthlyBudget ? "red" : "#4caf50",
          }}
        ></div>
      </div>

      <p
        style={{
          ...styles.text,
          color: spent > monthlyBudget ? "red" : "#4caf50",
        }}
      >
        Remaining: ₹{remainingBudget < 0 ? 0 : remainingBudget}
      </p>

      {spent > monthlyBudget && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Alert: You have exceeded your budget!
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "#ffffff",
    textAlign: "center",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#4f46e5",
  },
  subHeading: {
    fontSize: "24px",
    marginTop: "30px",
    marginBottom: "10px",
    color: "#3b82f6",
  },
  budgetBox: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    margin: "10px",
    borderRadius: "5px",
    border: "none",
    width: "200px",
  },
  button: {
    padding: "10px 20px",
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  text: {
    fontSize: "18px",
  },
  progressBar: {
    background: "#334155",
    height: "20px",
    width: "80%",
    margin: "0 auto",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
  },
};

export default BudgetManage;
