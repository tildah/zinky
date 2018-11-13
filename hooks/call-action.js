module.exports = async function (req, res) {
  var act = req.module[req.operation];
  await req.A.runORCatch(act, req, res, null, req.module);
}