# Kishori Global Hospitals — Backend Starter

This starter adds a Node.js/Express REST API with MongoDB for the existing HTML/CSS/JavaScript website.

## Included
- JWT login and role-based authorization
- Patient, doctor, staff, appointment, medical-record and contact-enquiry models
- Appointment and contact form API endpoints
- Admin dashboard summary endpoint
- Audit-log model
- Input validation, rate limiting, Helmet, CORS configuration and centralized error handling
- One-time admin seeding command
- Frontend integration guide

## Requirements
- Node.js 20+
- MongoDB Atlas or a local MongoDB instance

## Setup
1. Extract this folder.
2. Open a terminal inside `backend/`.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
6. Run `npm run seed:admin` once to create the initial administrator.
7. Run `npm run dev`.
8. API health check: `http://localhost:5000/api/v1/health`

Never commit `.env` or real patient data. Use synthetic data for development.

## Main API routes
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/appointments` (public appointment request; creates `pending` request)
- `GET /api/v1/appointments` (authorized staff)
- `PATCH /api/v1/appointments/:id/status` (authorized staff)
- `POST /api/v1/contacts` (public general enquiry)
- `GET/POST /api/v1/patients` (authorized staff)
- `GET/POST /api/v1/doctors` (authorized staff)
- `GET/POST /api/v1/staff` (admin only)
- `GET/POST /api/v1/medical-records` (authorized clinical roles)
- `GET /api/v1/dashboard/summary` (admin/authorized staff)

## Important production work still required
This is a development starter, not a certified or production-ready hospital information system. Before using real patient information, add a security review, deployment hardening, backups and recovery testing, monitoring, data-retention rules, consent/privacy review, secure file upload/storage, stronger audit review workflows, and applicable legal/compliance checks. Medical-record access is deliberately restricted. Do not store medical files directly in MongoDB documents.
