const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please tell us your name' ]
    },
    email: {
        type: String,
        required: [true, 'Please tell your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a vaid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate:{
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwods are not same'
        }
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next;
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema)

module.exports = User
