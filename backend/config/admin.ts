import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', env('JWT_SECRET', 'dev-admin-secret-change-me')),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'dev-api-token-salt-change-me'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'dev-transfer-token-salt-change-me'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'dev-encryption-key-change-me'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

export default config;
