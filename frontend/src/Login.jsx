import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import coverPic from './assets/images/cover-pic.webp';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { email, pass })
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "Login successful") {
          navigate("/home", { state: { email } });
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <section className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <br />
          <button type="submit">Submit</button>
          <Link to="/signup">Create an account?</Link>
        </form>
      </section>

      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: url(${coverPic}) no-repeat center center fixed;
            background-size: cover;
            font-family: 'Poppins', sans-serif;
          }

          .login-box {
            width: 320px;
            padding: 30px;
            text-align: center;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.9));
          }

          .login-box h2 {
            margin-bottom: 15px;
            font-size: 24px;
            color: #333;
            font-weight: 600;
          }

          input {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.85);
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          input:focus {
            border: 2px solid #3498db;
            outline: none;
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
          }

          button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #3498db, #217dbb);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 17px;
            cursor: pointer;
            margin-top: 15px;
            font-weight: 600;
          }

          button:hover {
            background: linear-gradient(135deg, #217dbb, #1a5d8e);
            transform: scale(1.03);
          }

          a {
            display: block;
            margin-top: 12px;
            font-size: 14px;
            color: #3498db;
            text-decoration: none;
            font-weight: 600;
          }

          a:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
