# TerraCRM 🌱

TerraCRM es una plataforma SaaS B2B Multi-tenant diseñada específicamente para ONGs de conservación ambiental. Permite a múltiples organizaciones administrar de manera independiente sus recursos, proyectos, fondos y métricas de impacto desde una única infraestructura escalable, asegurando un aislamiento total de datos (aislamiento por esquemas de PostgreSQL).

## 🚀 Fases Completadas (Arquitectura Resumida)

El desarrollo del sistema se ha completado a través de 3 fases arquitectónicas, resolviendo diferentes retos organizativos:

### Fase 1: MVP Monolito
- **Resolvió**: Las necesidades operativas básicas de una sola ONG.
- **Módulos**: Gestión de Voluntariado, Ciclo de Vida de Proyectos (Planificación, Activo, Completado) y Control manual de Donaciones.
- **Seguridad Básica**: Autenticación con NextAuth y registro de usuarios.

### Fase 2: Escalamiento Operativo e Impacto
- **Resolvió**: La necesidad de demostrar impacto público y financiar los proyectos automáticamente.
- **Módulos**: Transparencia pública, reportes dinámicos institucionales (Excel/PDF) e Integración de pagos con **Stripe** para captación de donaciones online.
- **Comunicaciones**: Emails automatizados usando **Resend**.
- **Control**: Implementación estricta de Roles (RBAC: Super Admin, Director, Auditor, Coordinador, Tesorero).

### Fase 3: SaaS Multi-Tenancy Regional
- **Resolvió**: El escalamiento de la plataforma para servir a decenas de ONGs en todo Latinoamérica desde la misma infraestructura y mejorar las labores de recolección de datos en campo.
- **Aislamiento**: Migración a **PostgreSQL** con esquemas aislados por tenant (`tenant_fundemar`, `tenant_cebse`) orquestado de forma transparente por Prisma.
- **PWA Offline**: Aplicación web progresiva offline-first para registrar métricas de campo sin internet usando **IndexedDB**.
- **GIS (Mapas)**: Interfaz y capacidad de almacenamiento geoespacial gracias a **PostGIS** y **React-Leaflet**.
- **Integración SaaS**: Webhooks protegidos con HMAC para **KoboToolbox** y una API REST Pública rate-limited con **Upstash Redis**.

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Shadcn UI
- **Base de Datos**: PostgreSQL + PostGIS
- **ORM**: Prisma (con Custom Client Extensions)
- **Autenticación**: NextAuth.js
- **i18n**: next-intl (Soporte Español / Inglés)
- **Pagos**: stripe
- **Emails**: resend
- **Mapas (GIS)**: react-leaflet + leaflet-draw
- **PWA y Offline Sync**: @ducanh2912/next-pwa + idb
- **Rate Limiting (Redis)**: @upstash/redis + @upstash/ratelimit
- **API Docs**: swagger-ui-react
- **Validación**: Zod

## ⚙️ Variables de Entorno Requeridas

Para iniciar el sistema en desarrollo o producción, tu `.env` debe incluir la siguiente configuración (referencia: `.env.example`):

```env
# Base de datos (PostgreSQL Obligatorio para soportar schemas y PostGIS)
DATABASE_URL="postgresql://user:password@localhost:5432/ong_crm?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/ong_crm?schema=public"

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Integraciones de Terceros (Fase 2)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."

# Rate Limiting (Fase 3 - Upstash Redis)
UPSTASH_REDIS_REST_URL="https://your-upstash-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

## 🛠️ Instalación y Operación Local

1. Instala las dependencias:
```bash
npm install
```

2. Genera el cliente Prisma e inserta los modelos iniciales en el schema public:
```bash
npx prisma generate
npx prisma db push
```

### Onboarding de nuevos Tenants (Nuevas ONGs)
Para registrar una nueva ONG en el sistema SaaS, ejecuta el script de onboarding. Esto generará el schema de base de datos (`tenant_{slug}`), clonará las tablas necesarias de forma automática (incluyendo los mapeos de Kobo) y creará un administrador maestro:

```bash
npx tsx scripts/onboard-tenant.ts {slug} "{Nombre de la ONG}"
# Ejemplo: npx tsx scripts/onboard-tenant.ts fundemar "Fundemar República Dominicana"
```

### Migración de un sistema legado (Monolito) a Multi-Tenant
Si estás actualizando una instalación previa de la Fase 2, ejecuta este script para transferir los datos actuales a la estructura SaaS:
```bash
npx tsx scripts/migrate-to-multitenant.ts
```

## 📄 Documentación API

TerraCRM ofrece una API REST pública (v1) para consulta de impacto, datos de proyectos y resúmenes financieros. La API incluye Rate Limiting a nivel de red protegido por Upstash Redis.

La documentación interactiva de la API está disponible localmente accediendo a:
**[http://localhost:3000/api/docs](/api/docs)** (Aislada de la internacionalización y autenticación de la UI principal).

---
*Hecho con tecnología y propósito para la conservación de la biodiversidad.*
