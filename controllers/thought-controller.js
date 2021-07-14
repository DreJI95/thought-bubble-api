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
        .populate({
            path: ['reactions'],
            //select: '-__v'
        })
        //.select('__v')
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400)});
        },
    
    //POST new thought
    addThought({body}, res){
        Thought.create(body)
            .then(dbThoughtData => {
                User.findOneAndUpdate({username: body.username}, {$push: {thoughts: dbThoughtData._id} })
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    },

    //PUT to update thought by _ids
    updateThought({params, body}, res){
        Thought.findOneAndUpdate({ _id: params.id}, body, {new: true, runValidators: true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
        })
        .catch(err => res.json(err));
    },

    //DELETE existing thoughts and thoughts by _ids
    deleteThought(){
        thought.findOneAndDelete({ _id: params.id})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
        })
        .catch(err => res.json(err));
    },

    //POST new friend to thought
    addThoughtReaction({params}, res){
        Thought.findOneAndUpdate({_id: params.thoughtId} , { $push: { reactions: params.reactions} }, {runValidators: true})
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No thought found with this id!'});
                    return;
                }
            })
            .catch(err => res.json(err));
    },

    //DELETE a friend of thought
    deleteThoughtReaction({params}, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $pull: { reactions: params.reactions } })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
        })
        .catch(err => res.json(err));
    }

}

module.exports = thoughtController;