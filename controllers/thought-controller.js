const { Thought, User} = require('../models');

const thoughtController = {
    //GET all thoughts
    getAllThoughts(req,res){
        Thought.find({})
            //.select('__v')
            .sort({ _id: -1})
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    //GET thought by id
    getThoughtById({params}, res) {
        Thought.findOne({ _id: params.id})
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400)});
        },
    
    //POST new thought
    addThought({body}, res){
        Thought.create(body)
            .then(dbThoughtRes => {
               return User.findOneAndUpdate({_id: body.userId}, {$push: {thoughts: dbThoughtRes._id} }, {new: true});
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No User found with this id!'});
                    return;
                }                
                res.json(dbThoughtData)})
            .catch(err => res.json(err));
    },

    //PUT to update thought by _ids
    updateThought({params, body}, res){
        Thought.findOneAndUpdate({ _id: params.id}, {thoughtText: body.thoughtText}, {new: true, runValidators: true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    //DELETE thoughts by _ids
    deleteThought({params}, res){
        Thought.findOneAndDelete({ _id: params.id})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
            return User.findOneAndUpdate({username: dbThoughtData.username}, { $pull: {thoughts: dbThoughtData._id}} , {new: true})
        })
        .catch(err => res.json(err));
    },

    //POST new reaction to thought
    addThoughtReaction({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId} , {$push: {reactions: body}}, { new: true, runValidators: true})
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No thought found with this id!'});
                    return ;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    //DELETE a reaction of thought
    deleteThoughtReaction({params}, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
          ).then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }

}

module.exports = thoughtController;