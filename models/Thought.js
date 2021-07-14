const { Schema, model } = require('mongoose');

const ThoughtSchema = new Schema({

    thoughtText:{
        type: String,
        required: [true, 'Username required'],
        validator: function() {
            return /{1,280}/
        },
        message: props => `Your thoughts need to be between 1 to 280 characters.`
    },
    createdAt:{
        type: Date,
        default: Date.now,
        /*get: createdAtVal => dateFormat(createdAtVal) //include getter for date format */
    },
    username:{
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;