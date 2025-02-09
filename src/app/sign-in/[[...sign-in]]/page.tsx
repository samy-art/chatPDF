import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-[url('https://t3.ftcdn.net/jpg/08/68/51/04/360_F_868510427_vsvN67LV1zSmLMyXMOFG05tRCmTAj1xL.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Gradient Overlay */}
      <span className="absolute inset-0 bg-black/50"></span>

      {/* Sign-In Text Directly Over Background */}
      <h1 className="relative z-10 text-3xl font-bold text-white mb-6 text-center">
        Sign in to Your Account
      </h1>

      {/* Sign-In Form Directly on Background */}
      <SignIn className="relative z-10" />
    </section>
  );
}
