const express = require('express');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/auth', authRoutes);

app.listen(5001, () => {
    console.log('Server running at port 5001');
});