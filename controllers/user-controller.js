const { User } = require('../models');

const userController = {
    //GET all users
    getAllUsers(req,res){
        User.find({})
            //.select('__v')
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
        .populate({
            path: ['thoughts', 'friends'],
            //select: '-__v'
        })
        //.select('__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400)});
        },
    
    //POST new user users
    addUser({body}, res){
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

    //PUT to update user by _ids
    updateUser({params, body}, res){
        User.findOneAndUpdate({ _id: params.id}, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No User found with this id!'});
                return;
            }
        })
        .catch(err => res.json(err));
    },

    //DELETE existing users and thoughts by _ids
    deleteUser(){
        User.findOneAndDelete({ _id: params.id})
        .deleteMany({
            path: 'thoughts'
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No User found with this id!'});
                return;
            }
        })
        .catch(err => res.json(err));
    }

}

module.exports = userController;