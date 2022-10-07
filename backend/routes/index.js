const Router = require('express');
const router = new Router();

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const categoryRouter = require('./categoryRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/categories', categoryRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

module.exports = router;