export default function errorMiddleware(error, req, res, next) {
  res.status(500).json({ servererror: error.message });
}
