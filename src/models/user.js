const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(val) {
            const badList = ['password', 'qwerty', '123456'];
            badList.forEach((pass) => {
                if (val.toLowerCase().includes(pass)) {
                    throw new Error('Password is too easy')
                }
            })
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid credentials!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid credentials!');
    }

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

// TODO? Remake witwh mongoose-hidden or using .select
userSchema.methods.toJSON = function() {
    const user = this.toObject();

    delete user.password;
    delete user.tokens;
    delete user.__v;
    delete user.avatar;

    return user;
}

// Hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
})

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({user: user._id});
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;