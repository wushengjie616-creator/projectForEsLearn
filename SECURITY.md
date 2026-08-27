# Security Policy

## Supported version

Security fixes are applied to the current `main` branch. This early-stage project does not maintain older release branches.

## Reporting a vulnerability

Please do not disclose vulnerabilities, credentials, invitation codes, or user data in a public issue.

Use GitHub's private vulnerability reporting for this repository:

1. Open the repository's **Security** tab.
2. Choose **Advisories** and **Report a vulnerability**.
3. Include affected routes or files, reproduction steps, impact, and a proposed mitigation if available.

Repository maintainers should enable **Settings → Security → Private vulnerability reporting** before making the repository public. If that channel is unavailable, contact the repository owner privately through the contact method shown on the owner's GitHub profile and include no live secret in the first message.

## Sensitive data

Never attach `.env.local`, `SUPABASE_SECRET_KEY`, `DEEPSEEK_API_KEY`, `SESSION_SECRET`, plaintext invitation codes, database exports, or real learner content to a report. Revoke and replace any credential that may have been exposed.
