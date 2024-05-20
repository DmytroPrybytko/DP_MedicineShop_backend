import User from '../models/user.js';
import errorHelper from '../util/error.js';

export const getUserProfile = async (req, res, next) => {
    // console.log(req.userId);
    try {
        if (!req.userId) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findById(req.userId);

        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(user);
    } catch (error) {
        errorHelper.generalError(error, next);
    }
};

export const updateUserProfile = async (req, res, next) => {
    const userId = req.userId;

    try {
        if (!userId) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        const { fullName, address, phone } = req.body;

        user.fullName = fullName;
        user.address = address;
        user.phone = phone;

        const updatedUser = await user.save();

        if (!updatedUser) {
            const error = new Error('Can not update user profile.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'User profile successfully updated.',
            _id: updatedUser._id,
        });
    } catch (error) {
        errorHelper.generalError(error, next);
    }
};
