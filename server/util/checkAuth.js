const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = (context) => {
    // context = {...headers}
    const authHeader = context.req.headers.authorization;

    if (authHeader) {
        // Bearer ...
        const token = authHeader.split("Bearer ")[1];

        if (token) {
            try {
                const user = jwt.verify(token, JWT_SECRET);
                return user;
            } catch {
                throw new AuthenticationError("Invalid or expired token.");
            }
        }
        throw new Error("Authentication token must be valid formate");
    }
    throw new Error("Authorization header must be provided");
};
