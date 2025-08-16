---
alwaysApply: true
---

Security Requirements:
1. Authentication/Authorization:
   - JWT-based (never sessions)
   - Refresh token rotation
   - Rate limiting on all endpoints
   - Brute-force protection

2. Data Validation:
   - Validate ALL inputs with Zod
   - SQL injection prevention via Prisma
   - XSS protection through React
   - CSRF tokens for state-changing operations

3. Role Checks:
   - Check role on EVERY route
   - Least privilege principle
   - Explicit permissions only

4. Privacy:
   - GDPR compliant
   - Data encryption at rest
   - No tracking cookies
   - Right to erasure implementation