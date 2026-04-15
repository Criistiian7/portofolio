import { useState } from "react";

type Props = {
  setUser: (user: string) => void;
};

export default function Auth({ setUser }: Props) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem("user", name);
    setUser(name);
  };

  return (
    <div className="card auth">
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Start</button>
    </div>
  );
}
