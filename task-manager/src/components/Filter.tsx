import { useState } from "react";

export default function Filter({ setFilter }: any) {
  return (
    <div className="filters">
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("active")}>Active</button>
      <button onClick={() => setFilter("completed")}>Done</button>
    </div>
  );
}
