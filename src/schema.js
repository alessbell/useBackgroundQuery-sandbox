/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from "graphql";

const LetterType = new GraphQLObjectType({
  name: "Letter",
  fields: {
    id: { type: GraphQLInt },
    letter: { type: GraphQLString }
  }
});

export const data = "ABCDEFG"
  .split("")
  .map((letter, index) => ({ letter, id: index + 1 }));

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    letters: {
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve: function (_, { offset = 0, limit = 2 }) {
        const lettersList = data.slice(offset, offset + limit);
        console.log(lettersList);
        return lettersList;
      },
      type: new GraphQLList(LetterType)
    }
  }
});

export const schema = new GraphQLSchema({ query: QueryType });
