const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const MONGODB_URI = 'mongodb+srv://root:rEh5yNBxL@cluster0.5gsms.mongodb.net/shop';

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
	handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const store = new MongoStore({
	collection: 'sessions',
	uri: MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'some secret value',
		resave: false,
		saveUninitialized: false,
		store
	})
);
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
}

start();
