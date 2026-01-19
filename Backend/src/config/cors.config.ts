import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  // Support multiple origins separated by comma
  // Also support Vercel preview URLs dynamically
  const origins = corsOrigin.split(',').map(o => o.trim());

  return {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check if origin matches any allowed origin
      const isAllowed = origins.some(allowed => {
        if (origin === allowed) return true;
        // Support Vercel preview URLs (e.g., project-hash-user.vercel.app)
        if (allowed.includes('.vercel.app')) {
          const baseDomain = allowed.replace('https://', '').replace('.vercel.app', '');
          // Match preview URLs like: baseDomain-xxxxx-user.vercel.app
          if (origin.includes(baseDomain) && origin.includes('.vercel.app')) {
            return true;
          }
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: process.env.CORS_CREDENTIALS === 'true',
  };
});
