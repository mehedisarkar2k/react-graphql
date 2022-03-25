const gql = require("graphql-tag");

module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        userName: String!
    }
    type User {
        id: ID!
        userName: String!
        email: String!
        token: String!
        createdAt: String!
    }
    input RegisterInput {
        userName: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(userName: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
    }
`;
