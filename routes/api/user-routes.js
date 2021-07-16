const router = require('express').Router();

const{
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    addUserfriend,
    deleteUserfriend
} = require('../../controllers/user-controller');

router.route('/')
.get(getAllUsers)
.post(addUser);

router.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

router.route('/:userId/friends/:friendsId')
.post(addUserfriend)
.delete(deleteUserfriend);

module.exports = router;