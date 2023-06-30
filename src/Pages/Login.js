import React, { useState } from "react";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = props;

  return (
    <div>
      <h1>Login Page!</h1>
      <label>Email</label>
      <input
        type="text"
        name="email"
        value={email}
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        name="password"
        value={password}
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Log in</button>
    </div>
  );
}
