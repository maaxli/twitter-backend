const express = require('express');
const tokenValidator = require('../middleware/validateTokenHandler');

const router = express.Router();
const {
    getTweets,
    getTweet,
    createTweet,
    // updateTweet,
    deleteTweet,
} = require('../controllers/tweetController');

router.route('/').get(getTweets);
router.route('/:id').get(getTweet);
router.post('/', tokenValidator, createTweet);
router.delete('/:id', tokenValidator, deleteTweet); 
//router.put('/', tokenValidator, updateTweet);

module.exports = router;