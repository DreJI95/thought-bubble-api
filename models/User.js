const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema({

    username:{
        type: String,
        unique: [true, 'Username is also used'],
        required: [true, 'Username required'],
        trim: true
    },
    email:{
        type: String,
        unique: [true, 'Email is also used'],
        validate: {
            validator: function(checkEmail) {
                return (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(checkEmail);
            },
            message: props => `${props.value} is not an email address.`
        },
        required: [true, 'Email required'],
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
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