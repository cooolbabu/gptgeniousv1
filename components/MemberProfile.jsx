import { UserButton, currentUser, auth } from "@clerk/nextjs";
async function MemberProfile() {
  const user = await currentUser();
  const { userId } = auth();
  console.log("Member profile: ", user);
  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}

export default MemberProfile;
