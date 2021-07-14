const { User } = require('../models');

const userController = {
    //GET all users
    getAllUsers(req,res){
        User.find({})
            .sort({ _id: -1})
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    //GET user by id
    getUserById({params}, res) {
        User.findOne({ _id: params.id})
        .populate('thoughts','friends')
        //.select('__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400)});
        },
    
    //POST new user
    addUser({body}, res){
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

    //PUT to update user by _ids
    updateUser({params, body}, res){
        User.findOneAndUpdate({ _id: params.id}, {username: body.username, email: body.email}, {new: true, runValidators: true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No User found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //DELETE existing users and thoughts by _ids
    deleteUser({params}, res){
        User.findOneAndDelete({ _id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No User found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //POST new friend to user
    addUserfriend({params}, res){
        User.findOneAndUpdate({_id: params.userId} , { $push: { friends: params.friendsId } }, {runValidators: true})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No User found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //DELETE a friend of user
    deleteUserfriend({params}, res){
        User.findOneAndUpdate({ _id: params.userId}, { $pull: { friends: params.friendsId } })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No User found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }

}

module.exports = userController;