const express = require('express');
const tokenValidator = require('../middleware/validateTokenHandler');

const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser);
router.put('/:id', tokenValidator, updateUser);
router.delete('/:id', tokenValidator, deleteUser);

module.exports = router;