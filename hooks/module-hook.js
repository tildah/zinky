module.exports = async function (req, res) {
  if (req.module && req.module.hook)
    await req.A.runORCatch(req.module.hook, req, res, null, req.module);
};