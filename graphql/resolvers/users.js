const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const { UserInputError } = require("apollo-server");

//
const {
    validateRegisterInput,
    validateLoginInput,
} = require("../../util/validators");

// helper function
const generateToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            email: user.email,
            userName: user.userName,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

module.exports = {
    Mutation: {
        register: async (
            _,
            { registerInput: { userName, email, password, confirmPassword } }
        ) => {
            // Validate user data
            const { errors, valid } = validateRegisterInput(
                userName,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            // TODO: make sure user doesn't exist
            const findUserByEmail = await User.findOne({ email });
            const findUserByUserName = await User.findOne({ userName });
            console.log(findUserByEmail || findUserByUserName);

            if (findUserByEmail || findUserByUserName) {
                throw new UserInputError("Username or email already exist", {
                    errors: {
                        userName,
                        email,
                    },
                });
            }

            // TODO: hash the pass before store info to DB and create and ath token

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                userName,
                password,
                createdAt: new Date().toISOString(),
            });

            const result = await newUser.save();

            const token = generateToken(result);

            return {
                ...result._doc,
                id: result._id,
                createdAt: result.createdAt,
                token,
            };
        },

        login: async (_, { userName, password }) => {
            const { errors, valid } = validateLoginInput(userName, password);

            if (!valid) {
                throw new UserInputError("Errors", {
                    errors,
                });
            } else {
                const user = await User.findOne({ userName });

                if (user) {
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        errors.general = "Wrong credentials";
                        throw new UserInputError("Wrong credentials", {
                            errors,
                        });
                    }

                    const token = generateToken(user);

                    return {
                        ...user._doc,
                        id: user._id,
                        createdAt: user.createdAt,
                        token,
                    };
                }

                throw new UserInputError("Wrong credentials", {
                    errors,
                });

            }
        },
    },
};
