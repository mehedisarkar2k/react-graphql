const { model, Schema } = require("mongoose");

const postSchema = new Schema({
    userName: String,
    body: String,
    createdAt: String,
    comments: [
        {
            userName: String,
            body: String,
            createdAt: String,
        },
    ],

    likes: [
        {
            userName: String,
            createdAt: String,
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model("Post", postSchema);
