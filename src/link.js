/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { schema, data } from "./schema.js";

function delay(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

const staticDataLink = new ApolloLink((operation) => {
  return new Observable(async (observer) => {
    const { query, operationName, variables } = operation;
    // const { offset = 0, limit = 2 } = operation.variables;
    // const letters = data.slice(offset, offset + limit);
    await delay(300);
    try {
      const result = await graphql({
        schema,
        source: print(query),
        variableValues: variables,
        operationName
      });
      console.log(result);
      // observer.next({ data: { letters } });
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});

export const link = staticDataLink;
