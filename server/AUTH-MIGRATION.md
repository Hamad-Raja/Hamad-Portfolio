# Administrator credential migration

Before restarting the updated production server:

1. Keep your current deployment running while preparing the configuration. Do not change your password or database.
2. For a local server `.env` containing the existing `ADMIN_PASSWORD`, run `npm run migrate-admin` from `server/`. The script replaces that entry with `ADMIN_PASSWORD_HASH` using bcrypt and preserves the same password. It does not print passwords/hashes or touch MongoDB. Keep any backup outside the repository in secure storage.
3. If your hosting provider manages environment variables, hash the existing password locally using the same script against a temporary, ignored `server/.env`, then securely copy only `ADMIN_PASSWORD_HASH` to your provider. Delete the temporary plaintext source and remove `ADMIN_PASSWORD` from the provider. Never paste credentials into commands or Git.
4. Set `JWT_SECRET` to at least 32 random characters, `ADMIN_EMAIL` to the existing address, and explicit `CLIENT_ORIGIN` values. Restart and verify login before retiring the old deployment. Keep your original deployment available for rollback until verified.

Existing bcrypt hashes in `ADMIN_PASSWORD` remain accepted temporarily so they can be moved directly to `ADMIN_PASSWORD_HASH`. Plaintext values are rejected in every environment. Startup fails with a configuration error instead of silently accepting an insecure password.

New tokens expire after one hour. A changed signing secret invalidates previous tokens. Browser storage moves from persistent local storage to tab-scoped session storage; users must sign in again. Logout clears the browser token, but a copied bearer token remains valid until expiry. Stateless tokens are not remotely revoked. JavaScript can still access session storage: prevent XSS, use HTTPS, and avoid untrusted scripts. A future HttpOnly cookie design requires a separate CSRF/CORS migration.
