/*** APP ***/
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  SuspenseCache,
  InMemoryCache,
  gql,
  useReadQuery_experimental as useReadQuery,
  useBackgroundQuery_experimental as useBackgroundQuery,
} from "@apollo/client";

import { link } from "./link.js";
import "./index.css";

const query = gql`
  query letters($limit: Int, $offset: Int) {
    letters(limit: $limit, offset: $offset) {
      id
      letter
    }
  }
`;

function Child({ queryRef, fetchMore }) {
  return (
    <div>
      <h1>hello world</h1>
      <button
        onClick={() => {
          const fetchMoreOpts = { variables: { offset: 2, limit: 2 } };
          fetchMore(fetchMoreOpts);
        }}
      >
        Fetch more
      </button>
      <List queryRef={queryRef} />
    </div>
  );
}

function List({ queryRef }) {
  const { data, error } = useReadQuery(queryRef);
  return (
    <Suspense fallback={<div>Other loading...</div>}>
      <ul>
        {data.letters.map(({ letter, id }) => (
          <li data-testid="letter" key={id}>
            {letter}
          </li>
        ))}
      </ul>
    </Suspense>
  );
}

function App() {
  const [queryRef, { fetchMore }] = useBackgroundQuery(query, {
    variables: { offset: 0, limit: 2 },
  });

  return (
    <Suspense fallback={<div>HELLO</div>}>
      <Child fetchMore={fetchMore} queryRef={queryRef} />
    </Suspense>
  );
}

const suspenseCache = new SuspenseCache();
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const container = document.getElementById("root");
const root = createRoot(container);

function SuspenseFallback() {
  return <div>Loading...</div>;
}

root.render(
  <ApolloProvider client={client} suspenseCache={suspenseCache}>
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<SuspenseFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </ApolloProvider>
);
