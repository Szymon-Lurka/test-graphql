const gql = require('graphql-tag');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const uniqid = require('uniqid');
const typeDefs = gql`
type User {
    id: ID!
    email: String!
    name: String!
    friends: [User]!
}
type Query {
    me: User!
    user(id: ID!): User!
   }

input addFriendInput {
    email: String!
    name: String!
}
input addFriendToUserInput {
    friendID: ID!
    userID: ID!
}
type Mutation {
    addUser(input: addFriendInput): User!
    addFriendToUser(input: addFriendToUserInput): User!
}
`;


const me = {
    id: 'random_id',
    email: 'szimiszu@gmail.com',
    name: "Szymcio",
    friends: []
};

const users = [{
    id: 'random_user',
    email: 'user@gmail.com',
    name: "User",
    friends: []
},
{
    id: 'random_id',
    email: 'szimiszu@gmail.com',
    name: "Szymcio",
    friends: []
}
];

const resolvers = {
    Query: {
        me() {
            return me
        },
        user(_, {id}) {
            const user = users.find((user) => user.id === id);
            return user;
        }
    },
    Mutation: {
        addUser(_, {input}) {
            const id = uniqid();
            const newUser = {...input, id, friends: []};
            users.push(newUser);
            return newUser;
        },
        addFriendToUser(_, {input}) {
            const user = users.find((user) => user.id === input.userID);
            const friend = users.find((user) => user.id === input.friendID);
            if (me.id === input.userID) {
                me.friends.push(friend);
            }
            user.friends.push(friend);
            return friend
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});
const startServer = async () => {
    const {url} = await startStandaloneServer(server, {
        listen: {port: process.env.PORT || 80}
    });
    console.log(`Listening on: ${url}`);
}

startServer();
 