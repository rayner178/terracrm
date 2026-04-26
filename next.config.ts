import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src 'self' https://js.stripe.com;",
          },
        ],
      },
    ];
  },
};

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
