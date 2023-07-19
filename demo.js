const gql = require('graphql-tag');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeUser = gql`
type User {
    email: String!
    avatar: String!
    friends: [User]!
}
`;
const typeQuery = gql`
type Query {
    me: User!
    friends: [User]!
   }
`;

const typeDefs = gql`
   ${typeUser}
   ${typeQuery}
`;

const resolvers = {
    Query: {
        me() {
            return {
                email: 'yoda@master.com',
                avatar: 'http://yoda.png',
                friends: [
                    {
                        email: 'myemail@com',
                        avatar: 'http://master.jpg',
                        friends: []
                    },
                    {
                        email: 'myemail@com',
                        avatar: 'http://master.jpg',
                        friends: []
                    }
                ]
            }
        },
        friends() {
            return [];
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});
const startServer = async () => {
    const {url} = await startStandaloneServer(server, {
        listen: {port: 4000}
    });
    console.log(`Listening on: ${url}`);
}

startServer();
 