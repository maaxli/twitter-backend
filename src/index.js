const express = require('express');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);

app.listen(5001, () => {
    console.log('Server running at port 5001');
});