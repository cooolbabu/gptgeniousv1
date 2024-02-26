import { SignIn } from "@clerk/nextjs";

function SignInPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
}

export default SignInPage;
