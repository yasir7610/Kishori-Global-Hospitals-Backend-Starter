# API Reference

Base URL: `http://localhost:5000/api/v1`

## Authentication
`POST /auth/login`
```json
{ "email": "admin@example.com", "password": "your-password" }
```
Returns a short-lived JWT and user role. Protected requests use `Authorization: Bearer <token>`.

`GET /auth/me` — authenticated user profile.

## Public forms
`POST /appointments`
```json
{
  "patientName": "Demo Patient",
  "patientPhone": "9876543210",
  "department": "Cardiology",
  "appointmentDate": "2027-01-15",
  "appointmentTime": "Morning",
  "doctorName": "",
  "visitReason": "Routine consultation"
}
```
Returns `201` with a pending appointment request.

`POST /contacts`
```json
{
  "contactName": "Demo Visitor",
  "contactPhone": "9876543210",
  "contactEmail": "visitor@example.com",
  "enquiryCategory": "General",
  "contactMessage": "Please share clinic timings."
}
```

## Protected modules
- `GET /patients?page=1&limit=20&q=demo`
- `POST /patients` — `fullName`, `phone` required
- `GET /patients/:id`
- `GET /doctors?department=Cardiology`
- `POST /doctors` — admin; `fullName`, `department` required
- `PATCH /doctors/:id` — admin
- `GET /staff` — admin
- `POST /staff` — admin; `fullName`, `jobTitle` required
- `PATCH /staff/:id` — admin
- `GET /appointments?page=1&limit=20&status=pending`
- `PATCH /appointments/:id/status` — `status` required
- `GET /medical-records?patientId=<id>`
- `GET /medical-records/:id`
- `POST /medical-records` — doctor/admin; `patient`, `recordType`, `title`, `clinicalContent` required
- `GET /dashboard/summary`

## Role notes
- Admin: staff, doctors, patients, appointments, medical records, dashboard.
- Doctor: assigned clinical workflow must be further tightened before production; current starter allows certain staff routes but does not yet implement doctor-to-patient assignment filtering.
- Nurse/receptionist: staff workflows as specified in route permissions.
- Patient: medical-record routes filter to the linked patient profile, but patient account creation/linking must be implemented before enabling patient accounts.

The module routes are a starter scaffold. Validate all fields, ownership, assignment and business rules before production.
