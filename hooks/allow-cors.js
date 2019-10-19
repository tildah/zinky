module.exports = async (req, res) => {
  if (!req.A.allowCors) return;
  const { origins, headers, ...additional } = req.A.cors;
  const { origin: clientHost } = req.headers;
  const allowAll = origins.includes("*");
  const allowed = allowAll || origins.includes(clientHost);
  const origin = allowed ? clientHost : "";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", headers.join(","));
  Object.keys(additional).forEach(header => {
    res.setHeader(header, additional[header]);
  });
  if (req.method == "OPTIONS") return "Cors Allowed";
};
