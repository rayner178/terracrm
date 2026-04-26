# Políticas de Seguridad — TerraCRM

Este documento es de cumplimiento obligatorio para todos los desarrolladores del proyecto.

## 1. Política de Contraseñas

Toda contraseña de usuario debe cumplir con el esquema definido en `src/lib/schemas/auth.ts`:

- Mínimo **8 caracteres**
- Al menos **1 letra mayúscula**
- Al menos **1 número**

### Uso obligatorio en formularios y APIs

```typescript
import { changePasswordSchema } from "@/lib/schemas/auth";

const parsed = changePasswordSchema.safeParse({ newPassword });
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
}
```

## 2. Política de Subida de Archivos (Upload Policy)

Todo endpoint que reciba archivos **debe** usar el helper `src/lib/validateFile.ts` **antes** de procesar o almacenar el archivo.

- **Tamaño máximo**: 5MB
- **Tipos permitidos**: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`

### Ejemplo de implementación

```typescript
import { validateFile } from "@/lib/validateFile";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("archivo") as File | null;

  if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });

  const validation = validateFile(file);
  if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

  // Procesar archivo seguro...
}
```

## 3. Rate Limiting

Todo endpoint público debe pasar por los limitadores en `src/infrastructure/redis/rateLimiter.ts`:
- **API general**: 100 req/min por IP
- **Login**: 5 intentos / 15 minutos por IP

## 4. Aislamiento Multi-Tenant

Toda query a modelos que no sean `User` o `Tenant` pasa automáticamente por el proxy Prisma que inyecta el schema del tenant. No confiar en el frontend para determinar el acceso a datos.
