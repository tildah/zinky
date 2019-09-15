module.exports = async function (req, res) {
  if (req.module && req.module.hook)
    await req.A.runORCatch(req.module.hook.bind(req.module), req, res);
};