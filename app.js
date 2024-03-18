var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {CONNECT_DB} = require('./helpers/mongodb.helper')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses')
const session = require('express-session');
const Member = require('./models/member');
const Section = require('./models/section');

const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Course = require('./models/course');
const authenticate = require('./middleware/auth.middleware');

const PORT = process.env.PORT || 3001
const HOST_NAME = process.env.HOSTNAME || 'localhost'

var app = express();

app.use(session({
  secret: 'se160018',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/dashboard', async (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }

  // Fetch sections from the database
  const sections = await Section.find({});

  // Render the dashboard view with the sections
  res.render('dashboard', { sections });
});

app.get('/delete/:id', async (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }

  // Delete the section from the database
  await Section.findByIdAndDelete(req.params.id);

  // Redirect back to the dashboard
  res.redirect('/dashboard');
});

app.get('/add', async (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }

  // Fetch courses from the database
  const courses = await Course.find({});

  // Render the add-section view with the courses
  res.render('add-section', { courses });
});

app.post('/add', async (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }
  const courses = await Course.find({});


  try {
    console.log({body: req.body})
    // Create a new section
    const section = new Section({
      ...req.body,
      isMainTask: req.body.isMainTask === 'on'
    });

    // Save the section to the database
    await section.save();

    // Redirect back to the dashboard
    res.redirect('/dashboard');
  } catch (error) {
    // Handle the error
    console.error(error);
   // render the error page
   res.render('add-section', {
    error: {
      message: 'Error adding section'
    },
    courses
   });
  }
});

app.get('/edit/:id', async (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }

 const sectionId = req.params.id;
  // Fetch the section from the database
  const section = await Section.findById(sectionId);
  const courses = await Course.find({});
  // Redirect back to the dashboard
  res.render('edit-section', { section, courses });
});

app.post('/edit/:id', async (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }

  req.body;

  // Update the section in the database
  await Section.findByIdAndUpdate(req.params.id, {...req.body,
      isMainTask: req.body.isMainTask === 'on'
  });

  // Redirect back to the dashboard
  res.redirect('/dashboard');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const member = await Member.findOne({
    username
  })
  if (!member) {
    return res.status(400).send('Invalid username or password');
  }

  bcrypt.compare(password, member.password, (err, result) => {
    if (err) {
      return res.status(500).send('Internal server error');
    }

    if (!result) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ _id: member._id }, config.secretKey);
    req.session.token = token;

    res.redirect('/dashboard');
  });
});


app.post('/get-token', async (req, res) => {
  const { username, password } = req.body;
  const member = await Member.findOne({
    username
  })
  if (!member) {
    return res.status(400).send('Invalid username or password');
  }

  bcrypt.compare(password, member.password, (err, result) => {
    if (err) {
      return res.status(500).send('Internal server error');
    }

    if (!result) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ _id: member._id }, config.secretKey);
    res.json({
      token
    })
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', authenticate, coursesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http://${HOST_NAME}:${PORT}/`)
})

CONNECT_DB()

module.exports = app;