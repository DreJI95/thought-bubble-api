const { User, Thought } = require('../models');

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
        let obj = {};

        User.findOne({ _id: params.id})
        .then(dbUserData => { 
            obj.dbUser = dbUserData;
            return Thought.find({_id: {$in: dbUserData.thoughts}}, "-username");
        })
        .then(dbThoughtsData => {
            
            obj.dbThoughts = dbThoughtsData;
            return User.find({_id: {$in: obj.dbUser.friends}}, "-email -_id -friendCount");
        })
        .then(dbfriendData => {

            obj.dbFriends = dbfriendData
            res.json(obj)})
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
            return Thought.findOneAndUpdate({_id: {$in: dbUserData.thoughts}}, {username: body.username}, {new: true})
        })
        .catch(err => res.json(err));
    },

    //DELETE existing users and thoughts by _ids
    deleteUser({params}, res){
        User.findOneAndDelete({ _id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No User found with this id!'});
            }
            res.json(dbUserData);
            return Thought.deleteMany({_id: {$in: dbUserData.thoughts}});
        })
        .then(dbUserData => res.json(dbUserData))
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