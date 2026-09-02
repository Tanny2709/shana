import { AuthForm } from "@/components/auth-form";
import { signUpAction } from "@/lib/actions/auth";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <AuthForm mode="signup" action={signUpAction} />
    </main>
  );
}
