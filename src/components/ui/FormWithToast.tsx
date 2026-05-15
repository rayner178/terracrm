"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  action: (formData: FormData) => Promise<any>;
  successMessage: string;
  errorMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormWithToast({ action, successMessage, errorMessage, children, className }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.success === false) {
          toast.error(result.error || errorMessage || "Error");
        } else {
          toast.success(successMessage);
          formRef.current?.reset();
        }
      } catch (_e) {
        toast.error(errorMessage || "Error inesperado");
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className={className}>
      <fieldset disabled={isPending} className="space-y-4">
        {children}
      </fieldset>
    </form>
  );
}
