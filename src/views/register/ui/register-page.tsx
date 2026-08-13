// views/register/ui/register-page.tsx
import { RegisterForm } from "@/features/auth";
import { AuthSplitLayout } from "@/shared/ui";

export function RegisterPage() {
  return (
    <AuthSplitLayout
      title="Crear cuenta"
      subtitle="Empeza a gestionar tu campo con Rufo"
      formClassName="max-w-md"
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
