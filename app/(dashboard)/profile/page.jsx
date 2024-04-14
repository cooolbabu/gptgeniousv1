import { getTokensByUserId } from "@/utils/actions";
import { UserProfile, auth } from "@clerk/nextjs";

const ProfilePage = async () => {
  const { userId } = auth();
  let currentTokens = await getTokensByUserId(userId);

  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">Token Amount : {!currentTokens ? 0 : currentTokens.tokens}</h2>
      <UserProfile />
    </div>
  );
};
export default ProfilePage;
