const asyncHandler = require('express-async-handler');

//@desc Get all tweets from a user
//@route GET /tweets
//@access public
const getTweets = asyncHandler(async(req, res, err) => {
    res.json({ message: "route working!" });
});

//@desc Get a single tweet
//@route GET /tweets/:id
//@access public
const getTweet = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

//@desc Create a tweet
//@route POST /tweets
//@access private
const createTweet = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

//@desc Update a tweet
//@route PUT /tweets/:id
//@access private
/*
const updateTweet = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});
*/

//@desc Delete a tweet
//@route POST /tweets/:id
//@access private
const deleteTweet = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

module.exports = {
    getTweets,
    getTweet,
    createTweet,
    // updateTweet,
    deleteTweet,
}