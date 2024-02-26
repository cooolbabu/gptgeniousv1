import { SiOpenaigym } from "react-icons/si";
import ThemeToggle from "./Themetoggle";

function SidebarHeader() {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      <SiOpenaigym className="w-12 h-12 text-primary" />
      <h2 className="text-xl font-extrabold mr-auto">GPTGenius</h2>
      <ThemeToggle />
    </div>
  );
}

export default SidebarHeader;
