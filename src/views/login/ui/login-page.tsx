// views/login/ui/login-page.tsx
import { LoginForm } from "@/features/auth";
import { AuthSplitLayout } from "@/shared/ui";

export function LoginPage() {
  return (
    <AuthSplitLayout title="Rufo" subtitle="Gestion ganadera integral">
      <LoginForm />
    </AuthSplitLayout>
  );
}
