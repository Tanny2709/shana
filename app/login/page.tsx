import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/actions/auth";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <AuthForm mode="login" action={loginAction} />
    </main>
  );
}
