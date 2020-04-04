const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('./../models/userModel')
const catchAsync =require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true 
    }
    res.cookie('jwt', token, cookieOptions);
    user.password=undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.register = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    createSendToken(newUser, 201, res)
})

exports.login = catchAsync( async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        // next(new AppError('Please provide email and password !', 400))
        return res.status(400).json({
            status: 'error',
            message: 'Please provide email and password !'
        })
    }
    const user = await User.findOne({ email }).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))){
        // return next(new AppError('Incorrect email or password', 401))
        return res.status(400).json({
            status: 'error',
            message: 'Incorrect email or password'
        })
    }
    createSendToken(user, 200, res);
})

exports.protect = catchAsync( async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        // return next(new AppError('You are not logged in! Please log in to get secret access', 401))
        return res.status(400).json({
            status: 'error',
            message: 'You are not logged in! Please log in to get secret access'
        })
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        // return next(new AppError('The user with ths token no longer exist', 401));
        return res.status(400).json({
            status: 'error',
            message: 'The user with ths token no longer exist'
        })
    }
    
    if(currentUser.changedPasswordAfter(decoded.iat)){
        // return next(new AppError('User recently changed the password Please log in again',401))
        return res.status(400).json({
            status: 'error',
            message: 'User recently changed the password Please log in again'
        })
    }

    req.user = currentUser;
    next();
})
