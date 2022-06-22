const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

module.exports = {
  Query: {
    me: async (_, args, ctx) => {
      if (ctx.user) {
        const userData = await User.findOne({ _id: ctx.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("You are not logged in!");
    },
  },

  Mutation: {
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const isPasswordCorrect = await user.isCorrectPassword(password);

      if (!isPasswordCorrect) {
        throw new AuthenticationError("Wrong password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { bookData }, ctx) => {
      if (ctx.user) {
        const userUpdated = await User.findByIdAndUpdate(
          { _id: ctx.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return userUpdated;
      }

      throw new AuthenticationError(
        "You need to log in to perform this action!"
      );
    },
    removeBook: async (_, { bookId }, ctx) => {
      if (ctx.user) {
        const userUpdated = await User.findOneAndUpdate(
          { _id: ctx.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return userUpdated;
      }

      throw new AuthenticationError(
        "You need to log in to perform this action!"
      );
    },
  },
};
