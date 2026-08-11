import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

async function handleLogin() {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/scanner");
  } catch (err) {
    setError("Invalid email or password");
  }
}

return (
  <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px' }}>
    <h2>Staff Login</h2>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {error && <p style={{ color: "red" }}>{error}</p>}

    <button onClick={handleLogin}>Login</button>
  </div>
);
}

export default Login;
