// ERROR 404 ON UNKNOWN ENDPOINTS
const notFoundMiddleware = (req, res) =>
  res.status(404).send("Route does not exist");

export default notFoundMiddleware;
