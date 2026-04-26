"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales inválidas");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input name="email" type="email" required placeholder="admin@terracrm.org" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Contraseña</label>
          <Input name="password" type="password" required placeholder="••••••••" className="mt-1" />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
}
