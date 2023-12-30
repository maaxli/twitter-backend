const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//@desc Get all users
//@route GET /users
//@access public
const getUsers = asyncHandler(async(req, res, err) => {
    const allUsers = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
        }
    });
    res.status(200).json(allUsers);
});

//@desc Get a single user
//@route GET /users/:id
//@access public
const getUser = asyncHandler(async(req, res, err) => {
    const { id } = req.params;
    const asNum = Number(id);
    if (isNaN(asNum)) {
        res.status(404).json({ error: "User does not exist"});
        return;
    }
    const user = await prisma.user.findUnique({
        where: {
            id: asNum,
        }
    });
    if (user === null) {
        res.status(404).json({ error: "User does not exist"});
        return;
    }
    res.status(200).json(user);
});

//@desc Create a user
//@route POST /users
//@access public
const createUser = asyncHandler(async(req, res, err) => {
    const { email, name, username } = req.body;
    if (!email || !name || !username) {
        res.status(400).json({ error: "All fields required." });
        return;
    }
    try {
        const newUser = await prisma.user.create({
            data: { email, name, username }
        });
        res.status(201).json(newUser);
    } catch (e) {
        res.status(400).json({ error: "Unable to create new user." }); // potentially due to unique fields
    }
});

//@desc Update a user
//@route PUT /users/:id
//@access private
const updateUser = asyncHandler(async(req, res, err) => {
    const { id } = req.params;
    const asNum = Number(id);
    if (isNaN(asNum)) {
        res.status(404).json({ error: "User does not exist." });
        return;
    }

    const { email, name, image, bio } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: asNum },
            data: { email, name, image, bio }
        })
        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(400).json({ error: "Unable to update user." });
    }
});

//@desc Delete a user
//@route POST /users/:id
//@access private
const deleteUser = asyncHandler(async(req, res, err) => {
    const { id } = req.params;
    const asNum = Number(id);
    if (isNaN(asNum)) {
        res.status(404).json({ error: "User does not exist." });
        return;
    }
    try {
        await prisma.user.delete({
            where: { id: asNum }
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({ error: "Delete request failed." });
    }
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}