import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Bienvenido a TerraCRM</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa tus credenciales para acceder al sistema.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
