"use client";
import { useState } from "react";

function Punchines() {
  const [gptPunchLines, setGptPunchLines] = useState("");
  return (
    <div className="flex flex-col mb-2">
      <h2>Punchlines</h2>

      <input
        type="text"
        placeholder=""
        className="input input-border join-item w-full h-full"
        value={gptPunchLines}
        required
        onChange={(e) => setGptPunchLines(e.target.value)}
      />
    </div>
  );
}

export default Punchines;
