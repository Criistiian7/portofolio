import { useState } from "react";

type Props = {
  setUser: (user: string) => void;
};

export default function Auth({ setUser }: Props) {
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const normalized = name.trim();
    localStorage.setItem("user", normalized);
    setUser(normalized);
  };

  return (
    <form className="card auth" onSubmit={handleLogin}>
      <label htmlFor="username">Name</label>
      <input
        id="username"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <button type="submit">Start</button>
    </form>
  );
}
