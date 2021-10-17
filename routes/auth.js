const User = require('../models/user');
const { Router } = require('express');
const router = Router();

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Авторизация',
		isLogin: true
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login');
	});
});

router.post('/login', async (req, res) => {
	const user = await User.findById('6162fd3ed2029a31c2fc043a');
	req.session.user = user;
	req.session.isAuthenticated = true;
	req.session.save(err => {
		if (err) throw err;
		res.redirect('/');
	});
});

module.exports = router;
