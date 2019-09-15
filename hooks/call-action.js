module.exports = async function (req, res) {
  const act = req.module && req.module[req.operation];
  await req.A.runORCatch(act.bind(req.module), req, res);
}