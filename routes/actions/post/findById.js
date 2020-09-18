// 验证模块
const Joi = require('joi');
// 用户模块
const { Post } = require('../../../model/Post');

module.exports = async (req, res) => {
	// 获取用户id
	const id = req.params.id;
	// 验证模型
	const schema = Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).error(new Error('id不符合格式'));
	// 验证
	const { error } = Joi.validate(id, schema)
	// 数据格式没有通过验证
	if (error) return res.status(400).send({ message: error.message });
	// 通过验证
	let islike = false
	let isFavorites = false
	if (req.session.userInfo) {
		const PostLike = await Post.findOne({ _id: id, likesUser: req.session.userInfo._id })
		const postFavorites = await Post.findOne({ _id: id, Favorites: req.session.userInfo._id })
		if (PostLike) {
			islike = true
		} else {
			islike = false
		}
		if (postFavorites) {
			isFavorites = true
		} else {
			isFavorites = false
		}
	}
	// 查询文章信息
	const post = await Post.findOne({ _id: id })
		.select('-likesUser -Favorites')
		.populate('author', 'avatar nickName')
		.populate('category')
	// 增加文章阅读数量
	post.meta.views = post.meta.views + 1;
	// 保存
	await post.save();
	// 响应
	return res.send({ islike: islike, isFavorites: isFavorites, post: post });

}