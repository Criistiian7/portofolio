import { useState } from "react";

export default function Auth({ setUser }: any) {
  const [name, setName] = useState("");

  const login = () => {
    if (!name.trim()) return;
    localStorage.setItem("user", name);
    setUser(name);
  };

  return (
    <div className="auth">
      <h2>Welcome</h2>
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={login}>Enter</button>
    </div>
  );
}
