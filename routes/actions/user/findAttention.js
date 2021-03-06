const { User } = require('../../../model/User')

module.exports = async (req, res) => {
  const id = req.params.id
  // 查询用户信息
  const limit = req.query.limit ? parseInt(req.query.limit) : 5
  const user = await User.find({ fans: id })
    .select('avatar nickName autograph')
    .limit(limit)
  res.send(user)
}