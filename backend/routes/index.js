const Router = require('express');
const router = new Router();

// const deviceRouter = require('./deviceRouter');
// const typeRouter = require('./typeRouter');
const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const categoryRouter = require('./categoryRouter');
const postRouter = require('./postRouter');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/categories', categoryRouter);
router.use('/posts', postRouter);

module.exports = router;