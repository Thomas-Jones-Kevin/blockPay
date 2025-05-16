import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import coverPic from './assets/images/cover-pic.webp';


function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/signup', { name, email, pass })
            .then((res) => {
                console.log(res);
                navigate('/login');
            })
            .catch((err) => console.error(err));
    }

    return (
        <div>
            <section className="login-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input id='name' type="text" placeholder='Your name' onChange={(e) => setName(e.target.value)} required />
                    <br />
                    <input id='email' type='email' placeholder='Your email' onChange={(e) => setEmail(e.target.value)} required />
                    <br />
                    <input id='pass' type='password' placeholder='Password' onChange={(e) => setPass(e.target.value)} required />
                    <br />
                    <button type='submit'>Submit</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
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

                    /* Centering the Box */
                    .login-box {
                        position: relative;
                        width: 320px;
                        padding: 30px;
                        text-align: center;
                        border-radius: 16px;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.2);

                        /* Background Image Inside Box */
                        background: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.9)), 
                                    url(${coverPic}) no-repeat center center;
                        background-size: cover;
                    }

                    /* Page Heading */
                    .login-box h2 {
                        margin-bottom: 15px;
                        font-size: 24px;
                        color: #333;
                        font-weight: 600;
                        text-align: center;
                    }

                    /* Input Fields */
                    input {
                        width: 100%;
                        padding: 12px;
                        margin: 8px 0;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        background: rgba(255, 255, 255, 0.85);
                        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
                        transition: all 0.3s ease-in-out;
                    }

                    /* Input Focus Effect */
                    input:focus {
                        border: 2px solid #3498db;
                        outline: none;
                        box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
                    }

                    /* Button Styling */
                    button {
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #3498db, #217dbb);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 17px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        margin-top: 15px;
                    }

                    button:hover {
                        background: linear-gradient(135deg, #217dbb, #1a5d8e);
                        transform: scale(1.03);
                    }

                    /* Sign-Up / Login Link */
                    p {
                        margin-top: 12px;
                        font-size: 14px;
                    }

                    p a {
                        color: #3498db;
                        text-decoration: none;
                        font-weight: 600;
                    }

                    p a:hover {
                        text-decoration: underline;
                    }

                    /* Responsive Design */
                    @media (max-width: 450px) {
                        .login-box {
                            width: 90%;
                            padding: 25px;
                        }

                        input {
                            padding: 10px;
                            font-size: 14px;
                        }

                        button {
                            font-size: 16px;
                        }
                    } 
                `}
            </style>
        </div>
    );
}

export default Signup;
