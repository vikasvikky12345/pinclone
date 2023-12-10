const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

const uri = 'mongodb+srv://vikky:vikas12345@cluster0.ljizzoj.mongodb.net/todotask?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Connection error:', err);
});
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  dp: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,

  },
});
userSchema.plugin(plm)
const User = mongoose.model('User', userSchema);

module.exports = User;
