const asyncHandler = require('express-async-handler');

//@desc Get all users
//@route GET /users
//@access public
const getUsers = asyncHandler(async(req, res, err) => {
    res.json({ message: "route working!" });
});

//@desc Get a single user
//@route GET /users/:id
//@access public
const getUser = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

//@desc Create a user
//@route POST /users
//@access public
const createUser = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

//@desc Update a user
//@route PUT /users/:id
//@access public
const updateUser = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

//@desc Delete a user
//@route POST /users/:id
//@access public
const deleteUser = asyncHandler(async(req, res, err) => {
    res.status(501).json({ error: "unimplemented" });
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}