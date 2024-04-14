import MemberProfile from "./MemberProfile";
import NavLinks from "./NavLinks";
import Punchines from "./Punchines";
import SidebarHeader from "./SidebarHeader";
import Tagsarea from "./Tagsarea";

function SideBar() {
  return (
    <div className="px-4 w-80 min-h-full bg-base-300 py-12 grid grid-rows-[auto,1fr,1fr,1fr,auto]">
      {/* first row */}
      <SidebarHeader />
      {/* second row */}
      <NavLinks />
      {/* third row */}
      <Tagsarea />
      <Punchines />
      <MemberProfile />
    </div>
  );
}

export default SideBar;
