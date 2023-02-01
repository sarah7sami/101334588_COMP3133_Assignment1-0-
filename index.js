const dotenv = require("dotenv");
dotenv.config();

const { ApolloServer } = require("apollo-server");
const { connection, connect } = require("mongoose");
const typeDefs = require("./schema");
const resolvers = require("./resolver");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    db: connection
  })
});

connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 4000 });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`);
  });
