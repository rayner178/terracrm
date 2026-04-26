import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  workboxOptions: {
    disableDevLogs: true,
    // Excluimos explícitamente las rutas privadas para evitar data leaks cross-tenant
    // Solo cacheamos recursos estáticos y la ruta /field
    exclude: [
      /\/admin/,
      /\/impact/,
      /\/projects/,
      /\/funding/,
      /\/volunteers/,
      /\/api\/(?!auth)/ // No cachear APIs excepto auth si fuera necesario
    ],
  }
});

export default withPWA(withNextIntl(nextConfig));
