# TerraCRM 🌱

TerraCRM es una plataforma SaaS B2B Multi-tenant diseñada específicamente para ONGs de conservación ambiental. Permite a múltiples organizaciones administrar de manera independiente sus recursos, proyectos, fondos y métricas de impacto desde una única infraestructura escalable, asegurando un aislamiento total de datos (aislamiento por esquemas de PostgreSQL).

🌊 **Diseño Dinámico**: Interfaz modernizada con temática oceánica y gradientes fluidos para una experiencia premium.

🌍 **URL de Producción**: [https://terracrm-ten.vercel.app](https://terracrm-ten.vercel.app)
🔑 **Credenciales de Demo**: `admin@fundemar.org` / `admin123`

## 🚀 Fases Completadas (Arquitectura Resumida)

### Fase 1: MVP Monolito
- **Módulos**: Gestión de Aliados, Ciclo de Vida de Proyectos y Control de Donaciones.
- **Seguridad Básica**: Autenticación con NextAuth y registro de usuarios.

### Fase 2: Escalamiento Operativo e Impacto
- **Módulos**: Transparencia pública, reportes dinámicos (Excel/PDF) e integración de pagos con **Stripe**.
- **Comunicaciones**: Emails automatizados con **Resend**.
- **Control**: RBAC estricto (Super Admin, Director, Auditor, Coordinador, Tesorero).

### Fase 3: SaaS Multi-Tenancy Regional
- **Aislamiento**: PostgreSQL con esquemas aislados por tenant (`tenant_fundemar`, `tenant_cebse`).
- **PWA Offline**: Aplicación offline-first con **IndexedDB** para trabajo de campo sin internet.
- **Integraciones**: Webhooks HMAC para **KoboToolbox** y API REST pública con rate limiting via **Upstash Redis**.
- **GIS**: Almacenamiento geoespacial con **PostGIS** y visualización con **React-Leaflet**.

### Fase 4: Resiliencia y Hardening (Producción 2026)
- **Auto-recuperación**: Implementación de **Global Error Boundaries** en Next.js para evitar pantallas blancas.
- **Degradación Elegante**: Manejo defensivo con `try/catch` en Prisma y NextAuth (fallbacks automáticos a estados seguros).
- **Mobile First**: Rediseño completo para dispositivos móviles con Sidebar Drawer, grids auto-ajustables y touch targets de mín. 44px.
- **i18n Avanzado**: Cobertura del 100% en español e inglés con metadatos dinámicos (SEO local) y detección de Caps Lock en formularios.
- **Importación Masiva**: Módulo de carga batch desde `.xlsx` (Aliados, Proyectos, Donaciones) con validación Zod fila por fila y wizard de 3 pasos.

### Módulo de Importación Masiva
- Importación de Aliados, Proyectos y Donaciones históricas desde archivos `.xlsx`
- Wizard de 3 pasos: subir → previsualizar → confirmar
- Validación fila por fila con Zod — los errores no detienen la importación
- Preview de las primeras 5 filas con indicadores visuales de errores
- Reporte final: registros importados vs fallidos con detalle
- Accesible en `/import` para roles `SUPER_ADMIN` y `DIRECTOR`

## 🔐 Seguridad Implementada

| Medida | Detalle |
|--------|---------|
| **Rate Limiting** | 5 intentos de login / 15 min por IP (Upstash Redis) |
| **Security Headers** | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **Auth Guard** | `getServerSession` en dashboard antes de cualquier query a Prisma |
| **mustChangePassword** | Admins nuevos forzados a cambiar contraseña en primer login |
| **Zod Validation** | Contraseñas: mín. 8 chars + mayúscula + número |
| **MIME Validation** | Helper `validateFile.ts` para subidas: JPEG, PNG, WEBP, PDF (máx. 5MB) |
| **JWT Invalidation** | `signOut()` forzado al cambiar contraseña para limpiar token viejo |
| **Password Visibility** | Toggle de visualización de contraseña en Login y Cambio de Password |
| **NextAuth Rate Guard** | Wrapper en `POST /api/auth/[...nextauth]` protege callback de credenciales |
| **Resiliencia de Datos** | Fallbacks en queries de Prisma (try/catch) para evitar crash ante schemas faltantes |
| **Caps Lock Detection** | Aviso visual en tiempo real para evitar bloqueos por errores de digitación |
| **Error Boundaries** | Intercepción global de errores 500 y 404 con botones de recuperación automática |

Consulta la política completa en [`docs/SECURITY.md`](./docs/SECURITY.md).

## 💻 Tech Stack Completo

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Shadcn UI
- **Base de Datos**: PostgreSQL + **PostGIS** (Supabase)
- **ORM**: Prisma (con Custom Client Extensions Multi-Tenant)
- **Caché / Rate Limiting**: Upstash Redis + `@upstash/ratelimit`
- **Autenticación**: NextAuth.js (JWT strategy)
- **i18n**: next-intl (Español / Inglés)
- **Pagos**: Stripe
- **Emails**: Resend
- **Mapas (GIS)**: react-leaflet + leaflet-draw
- **PWA y Offline Sync**: @ducanh2912/next-pwa + idb
- **Validación**: Zod
- **API Docs**: swagger-ui-react

## ⚙️ Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"
DIRECT_URL="postgresql://user:password@host:5432/db?schema=public"

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://terracrm-ten.vercel.app"

# Pagos (Fase 2)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Emails (Fase 2)
RESEND_API_KEY="re_..."

# Rate Limiting (Fase 3)
UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

## 🛠️ Instalación Local

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## 🏢 Onboarding de Nuevos Tenants

```bash
npx tsx scripts/onboard-tenant.ts {slug} "{Nombre de la ONG}"
# Ejemplo:
npx tsx scripts/onboard-tenant.ts cebse "CEBSE Costa Rica"
```

Esto crea el schema `tenant_{slug}`, clona las tablas y genera un admin inicial con `mustChangePassword: true`.

## 📄 Documentación API

API REST pública disponible en:
**[https://terracrm-ten.vercel.app/api/docs](https://terracrm-ten.vercel.app/api/docs)**

## 🗺️ Roadmap v2.0 — Basado en feedback operativo de FUNDEMAR

### Proyectos — Estructura financiera y operativa
- Campos: presupuesto total, fondos asignados, gastado, balance, % ejecutado
- Fechas de inicio y fin con duración restante
- Entregables/Hitos por proyecto con fecha límite y estado
- KPIs de impacto por proyecto (hectáreas, especies, beneficiarios)
- Barra de progreso financiera con alertas si supera presupuesto
- **Vista de proyecto**: al tocar un proyecto, ver todos sus datos relacionados (donaciones asignadas, aliados participantes, métricas de impacto, entregables) en una sola pantalla con gráficos integrados

### Finanzas — Separación Donaciones vs Fondos
- **Donaciones**: aportes libres de personas, campañas, Stripe, empresas
- **Grants/Fondos**: dinero restringido por proyecto de USAID, GEF, ONU, BID
- Dashboard financiero: total donaciones reales, grants activos, fondos comprometidos, burn rate mensual

### Aliados — Módulo expandido (renombrado desde Voluntarios)
- Tipos: Voluntario, Técnico/Consultor, Organización aliada, Líder comunitario, Cooperante internacional
- Vinculación a proyectos con roles y horas trabajadas
- Certificados de participación automáticos
- Centro de Comunidad: vista unificada de todos los aliados por proyecto

### Reportes Institucionales — Nuevas pestañas
- Financiero: ingresos vs gastos, ejecución presupuestaria, grants activos
- Recursos: aliados activos, horas acumuladas, rendimiento operativo
- KPI Ejecutivo: dashboard estilo CEO con tasa de ejecución y crecimiento
- Reportes para Donantes: PDFs automáticos con impacto, fotos y métricas

### Nuevos módulos planificados
- Calendario institucional: actividades, entregables, vencimientos, auditorías
- Gestión documental: contratos, convenios, permisos, evidencias fotográficas
- CRM de aliados/donantes: historial completo de organizaciones y donantes recurrentes
- Automatizaciones: alertas de presupuesto bajo, recordatorios de entregables, certificados para aliados

---
*Hecho con tecnología y propósito para la conservación de la biodiversidad. 🌿*
