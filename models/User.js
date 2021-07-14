const { Schema, model } = require('mongoose');
const {ThoughtSchema} = require();

const UserSchema = new Schema({

    username:{
        type: String,
        unique: [true, 'Username is also used'],
        required: [true, 'Username required'],
        trim: true
    },
    email:{
        type: String,
        unique: [true, 'Username is also used'],
        validate: {
            validator: function() {
                return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
            },
            message: props => `${props.value} is not an email address.`
        },
        required: [true, 'Email required'],
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thoughts'
      }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})

UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;