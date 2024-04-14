import { getTokensByUserId, getTokensOrInsertNewuser } from "@/utils/actions";
import { UserButton, currentUser, auth } from "@clerk/nextjs";
async function MemberProfile() {
  const user = await currentUser();
  const { userId } = auth();

  //console.log("Member profile: ", user);
  // console.log("Member profile - id ", user.id);
  // console.log("Member profile - Name: ", user?.firstName, " ", user?.lastName);
  // console.log("Member profile - Email: ", user?.emailAddresses[0]?.emailAddress);
  // console.log("User Id: ", userId);
  // console.log("Token count: ", await getTokensByUserId(userId));

  const userData = {
    userId: userId,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddress: user?.emailAddresses[0]?.emailAddress,
  };

  await getTokensOrInsertNewuser(userData);

  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}

export default MemberProfile;
