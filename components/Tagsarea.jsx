"use client";
import { useState } from "react";

function Tagsarea() {
  const [gptTags, setGptTags] = useState("");
  return (
    <div className="flex flex-col mb-2">
      <h2>Tags</h2>

      <input
        type="text"
        placeholder=""
        className="input input-border w-full h-full"
        value={gptTags}
        required
        onChange={(e) => setGptTags(e.target.value)}
      />
    </div>
  );
}

export default Tagsarea;
