var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const adRouter = require('./routes/ad');
module.exports = function(app) {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/ads', adRouter);
};
