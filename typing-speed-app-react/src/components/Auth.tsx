import { useState } from "react";

type Props = {
  setUser: (user: string) => void;
};

export default function Auth({ setUser }: Props) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem("user", name.trim());
    setUser(name.trim());
  };

  return (
    <div className="auth-wrap">
      <div className="card auth">
        <h2 className="card-title">Start typing</h2>
        <label className="auth-label" htmlFor="display-name">
          Your name
        </label>
        <input
          id="display-name"
          name="display-name"
          autoComplete="username"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />
        <button type="button" onClick={handleLogin}>
          Start
        </button>
      </div>
    </div>
  );
}
