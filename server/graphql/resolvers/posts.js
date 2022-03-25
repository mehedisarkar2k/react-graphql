const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                throw new Error(error);
            }
        },

        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId);

                if (post) {
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },

    Mutation: {
        createPost: async (_, { body }, context) => {
            const user = checkAuth(context);

            const newPost = new Post({
                body,
                user: user.id,
                userName: user.userName,
                createdAt: new Date().toISOString(),
            });

            const post = await newPost.save();

            return post;
        },

        deletePost: async (_, { postId }, context) => {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if (post.userName === user.userName) {
                    await post.delete();
                    return "Post deleted successfully";
                } else {
                    throw new AuthenticationError("Ops! Action not allowed!");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};
