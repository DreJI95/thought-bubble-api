const { Schema, model } = require('mongoose');

const ReplySchema = new Schema({

    reactionId:{
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody:{
        type: String,
        required: [true, 'Reply required'],
        validator: function() {
            return /{1,280}/
        },
        message: props => `Your replies need to be between 1 to 280 characters.`
    },
    username:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        /*get: createdAtVal => dateFormat(createdAtVal) //include getter for date format */
    },
})

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
    }
})

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;