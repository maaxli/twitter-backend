const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//@desc Get all tweets from a user
//@route GET /tweets
//@access public
const getTweets = asyncHandler(async(req, res, err) => {
    const { userId } = req.body;
    const allTweets = await prisma.tweet.findMany({
        where: { userId: userId }
    })
    res.json(allTweets)
});

//@desc Get a single tweet
//@route GET /tweets/:id
//@access public
const getTweet = asyncHandler(async(req, res, err) => {
    const { id } = req.params;
    const asNum = Number(id);
    if (isNaN(asNum)) {
        res.status(404).json({ error: "Tweet not found" });
        return;
    }
    const tweet = await prisma.tweet.findUnique({
        where: { id: asNum },
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                    image: true,
                    isVerified: true,
                }
            }
        }
    })
    res.json(tweet);
});

//@desc Create a tweet
//@route POST /tweets
//@access private
const createTweet = asyncHandler(async(req, res, err) => {
    const { content, image, userId } = req.body;
    if (!content || !userId ) {
        res.status(400).json({ error: "All fields required" });
        return;
    }
    try {
        const tweet = await prisma.tweet.create({
            data: {
                content: content,
                image: image,
                userId: userId,
            }
        });
        res.json(tweet);
    } catch (e) {
        res.status(400).json({ error: "Unable to create tweet" });
    }
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
    const { id } = req.params;
    const asNum = Number(id);
    if (isNaN(asNum)) {
        res.status(404).json({ error: "Tweet not found" });
        return;
    }
    try {
        prisma.tweet.delete({
            where: { id: asNum }
        })
        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({ error: "Delete request failed" });
    }
});

module.exports = {
    getTweets,
    getTweet,
    createTweet,
    // updateTweet,
    deleteTweet,
}