function notFound(req, res) {
  res.status(404).json({ message: "API route not found." });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed.", details: Object.values(err.errors).map(e => e.message) });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with this unique value already exists." });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid identifier." });
  const status = Number.isInteger(err.status) ? err.status : 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? "An unexpected server error occurred." : err.message });
}

module.exports = { notFound, errorHandler };
