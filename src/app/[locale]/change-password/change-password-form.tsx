"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cambiar contraseña");
      }

      // IMPORTANTE: Invalida la sesión actual para obligar a usar la nueva contraseña
      // y limpiar el token JWT viejo que tiene mustChangePassword: true
      await signOut({ callbackUrl: "/es/login" });
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">Nueva Contraseña</label>
        <input
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Cambiar Contraseña e Iniciar Sesión"}
      </button>
    </form>
  );
}
