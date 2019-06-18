module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", req.A.cors.headers.join(","));
  if (req.method == "OPTIONS") return "Cors Allowed";
};