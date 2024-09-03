import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import App from "./App.tsx";

const httpLink = createHttpLink({
  uri: "/api",
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      ...headers,
      "X-CSRF-TOKEN": token || "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
