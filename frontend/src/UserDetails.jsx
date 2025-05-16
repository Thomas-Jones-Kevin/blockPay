import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const UserDetails = () => {
  const location = useLocation();
  const email = location.state?.email || "User";
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [pass, setPass] = useState("");
  const [linkedUPI, setLinkedUPI] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [balance, setBalance] = useState(0);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.padding = 0;

    const fetchData = async () => {
      const res = await axios.post(`http://localhost:3001/userInfo/`, {
        email,
        mode: "fetch",
      });

      if (res.data !== "getInfo") {
        const info = res.data;
        setName(info.name);
        setPass(info.password);
        setMobile(info.mobile);
        setEmergencyContact(info.emergencyContact);
        setLinkedUPI(info.linkedUPI);
        setWalletAddress(info.walletAddress);
        setBalance(info.balance);
      } else {
        setEditMode(true);
      }
    };
    fetchData();
  }, [email]);

  const handleSave = async () => {
    const res = await axios.post("http://localhost:3001/userInfo", {
      email,
      name,
      mobile,
      walletAddress,
      pass,
      linkedUPI,
      emergencyContact,
      mode: "save",
    });
    console.log(res);
    setEditMode(false);
  };

  const handleAddBalance = async () => {
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      alert("Enter valid amount!");
      return;
    }

    const res = await axios.post("http://localhost:3001/userInfo", {
      email,
      amount: parseFloat(addAmount),
      balance: balance,
      mode: "addBalance",
    });
    if(res.data == "added"){
      const newAmt = parseFloat(addAmount)+balance;
      setBalance(newAmt);
      console.log("added");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>User Details</h1>

      <div style={styles.card}>
        {editMode ? (
          <>
            <input
              style={styles.input}
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Mobile No."
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Wallet Address"
              onChange={(e) => setWalletAddress(e.target.value)}
              value={walletAddress}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Linked UPI ID"
              onChange={(e) => setLinkedUPI(e.target.value)}
              value={linkedUPI}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Emergency Contact"
              onChange={(e) => setEmergencyContact(e.target.value)}
              value={emergencyContact}
              required
            />

            <button style={styles.button} onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <p style={styles.text}>
              <b>Name:</b> {name}
            </p>
            <p style={styles.text}>
              <b>Mobile:</b> {mobile}
            </p>
            <p style={styles.text}>
              <b>Wallet Address:</b> {walletAddress}
            </p>
            <p style={styles.text}>
              <b>Linked UPI:</b> {linkedUPI}
            </p>
            <p style={styles.text}>
              <b>Emergency Contact:</b> {emergencyContact}
            </p>
            <p style={styles.text}>
              <b>Balance:</b> ₹{balance}
            </p>

            <div style={styles.balanceContainer}>
              <input
                style={styles.input}
                type="number"
                placeholder="Enter Amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
              <button style={styles.button} onClick={handleAddBalance}>
                Add Balance
              </button>
            </div>

            <button
              style={{ ...styles.button, background: "#64748b" }}
              onClick={() => setEditMode(true)}
            >
              Edit Info
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "0",
    margin: "0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    fontSize: "36px",
    padding: "20px",
    color: "#4f46e5",
    margin: "0",
    textAlign: "center",
  },
  card: {
    background: "#1e293b",
    padding: "30px 40px",
    margin: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    outline: "none",
    fontSize: "16px",
    transition: "border 0.2s",
  },
  button: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.2s",
  },
  text: {
    fontSize: "18px",
    margin: "5px 0",
    textAlign: "left",
    wordWrap: "break-word",
  },
  balanceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default UserDetails;
