# Connect the existing frontend

The current website's forms are demo-only. The API starter accepts the existing appointment and contact field names.

## 1. Start the API
Follow `backend/README.md`. Ensure the API health endpoint works before connecting the frontend.

## 2. Appointment form
In the existing `script.js`, replace the demo-only section inside the `appointmentForm` submit handler with an API request. Keep the current client-side validation. Example:

```js
const payload = {
  patientName: document.getElementById("patientName").value.trim(),
  patientPhone: document.getElementById("patientPhone").value.trim(),
  department: document.getElementById("appointmentDepartment").value,
  appointmentDate: document.getElementById("appointmentDate").value,
  appointmentTime: document.getElementById("appointmentTime").value,
  doctorName: document.getElementById("doctorName").value.trim(),
  visitReason: document.getElementById("visitReason").value.trim()
};

const response = await fetch("http://localhost:5000/api/v1/appointments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
const result = await response.json();
if (!response.ok) throw new Error(result.message || "Unable to submit request.");
appointmentMessage.textContent = result.message;
appointmentForm.reset();
```

Because `await` is used, change the listener to `async (event) => { ... }` and wrap the request in `try/catch`. Do not show success unless the API returns a successful response. The API creates a **pending request**, not a confirmed appointment.

## 3. Contact form
Use the following payload in the existing contact form handler:

```js
const payload = {
  contactName: document.getElementById("contactName").value.trim(),
  contactPhone: document.getElementById("contactPhone").value.trim(),
  contactEmail: document.getElementById("contactEmail").value.trim(),
  enquiryCategory: document.getElementById("enquiryCategory").value,
  contactMessage: document.getElementById("contactMessage").value.trim()
};
const response = await fetch("http://localhost:5000/api/v1/contacts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
const result = await response.json();
if (!response.ok) throw new Error(result.message || "Unable to send enquiry.");
contactMessageStatus.textContent = result.message;
contactForm.reset();
```

Use `async`, `try/catch`, and display a clear error message if the request fails.

## 4. Admin dashboard
The existing `admin.html` login is hardcoded and is not secure. Do not use it for real records. Replace it with a login form that calls `POST /api/v1/auth/login`, store tokens only with a considered session strategy, and send `Authorization: Bearer <token>` for protected requests. For production, prefer short-lived access tokens with secure HttpOnly cookies and CSRF protection rather than long-lived tokens in browser storage.

After login:
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/appointments`
- `PATCH /api/v1/appointments/:id/status`

Never render user-provided text using `innerHTML`; use `textContent` or DOM methods to prevent cross-site scripting.

## Important
This guide is an integration outline, not an automatic edit of your website. Test with fake records first. The starter needs additional security review before real patient data is used.
