const express = require('express');

const router = express.Router();
const {
    getTweets,
    getTweet,
    createTweet,
    // updateTweet,
    deleteTweet,
} = require('../controllers/tweetController');

router.route('/').get(getTweets).post(createTweet);
router.route('/:id').get(getTweet).delete(deleteTweet); // .put(updateTweet)

module.exports = router;