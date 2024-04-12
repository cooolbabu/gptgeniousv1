"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState } from "react";

const themes = {
  nord: "nord",
  dim: "dim",
};

function ThemeToggle() {
  const [theme, setTheme] = useState(themes.nord);

  const toggleTheme = () => {
    const newTheme = theme === themes.nord ? themes.dim : themes.nord;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "nord" ? (
        <BsMoonFill className="h-4 w-4 " />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
}
export default ThemeToggle;
