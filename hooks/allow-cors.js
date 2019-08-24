module.exports = async (req, res) => {
  const { origins, headers, ...additional } = req.A.cors;
  res.setHeader("Access-Control-Allow-Origin", origins.join(","));
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", headers.join(","));
  Object.keys(additional).forEach(header => {
    res.setHeader(header, additional[header]);
  });
  if (req.method == "OPTIONS") return "Cors Allowed";
};