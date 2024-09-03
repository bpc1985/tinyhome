/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation ConnectStripe($input: ConnectStripeInput!) {\n    connectStripe(input: $input) {\n      hasWallet\n    }\n  }\n": types.ConnectStripeDocument,
    "\n  mutation CreateBooking($input: CreateBookingInput!) {\n    createBooking(input: $input) {\n      id\n    }\n  }\n": types.CreateBookingDocument,
    "\n  mutation DisconnectStripe {\n    disconnectStripe {\n      hasWallet\n    }\n  }\n": types.DisconnectStripeDocument,
    "\n  mutation HostListing($input: HostListingInput!) {\n    hostListing(input: $input) {\n      id\n    }\n  }\n": types.HostListingDocument,
    "\n  mutation LogIn($input: LogInInput) {\n    logIn(input: $input) {\n      id\n      token\n      avatar\n      hasWallet\n      didRequest\n    }\n  }\n": types.LogInDocument,
    "\n  mutation LogOut {\n    logOut {\n      id\n      token\n      avatar\n      hasWallet\n      didRequest\n    }\n  }\n": types.LogOutDocument,
    "\n  query AuthUrl {\n    authUrl\n  }\n": types.AuthUrlDocument,
    "\n  query Listing($id: ID!, $bookingsPage: Int!, $limit: Int!) {\n    listing(id: $id) {\n      id\n      title\n      description\n      image\n      host {\n        id\n        name\n        avatar\n        hasWallet\n      }\n      type\n      address\n      city\n      bookings(limit: $limit, page: $bookingsPage) {\n        total\n        result {\n          id\n          tenant {\n            id\n            name\n            avatar\n          }\n          checkIn\n          checkOut\n        }\n      }\n      bookingsIndex\n      price\n      numOfGuests\n    }\n  }\n": types.ListingDocument,
    "\n  query Listings(\n    $location: String\n    $filter: ListingsFilter!\n    $limit: Int!\n    $page: Int!\n  ) {\n    listings(location: $location, filter: $filter, limit: $limit, page: $page) {\n      region\n      total\n      result {\n        id\n        title\n        image\n        address\n        price\n        numOfGuests\n      }\n    }\n  }\n": types.ListingsDocument,
    "\n  query User($id: ID!, $bookingsPage: Int!, $listingsPage: Int!, $limit: Int!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      contact\n      hasWallet\n      income\n      bookings(limit: $limit, page: $bookingsPage) {\n        total\n        result {\n          id\n          listing {\n            id\n            title\n            image\n            address\n            price\n            numOfGuests\n          }\n          checkIn\n          checkOut\n        }\n      }\n      listings(limit: $limit, page: $listingsPage) {\n        total\n        result {\n          id\n          title\n          image\n          address\n          price\n          numOfGuests\n        }\n      }\n    }\n  }\n": types.UserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ConnectStripe($input: ConnectStripeInput!) {\n    connectStripe(input: $input) {\n      hasWallet\n    }\n  }\n"): (typeof documents)["\n  mutation ConnectStripe($input: ConnectStripeInput!) {\n    connectStripe(input: $input) {\n      hasWallet\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateBooking($input: CreateBookingInput!) {\n    createBooking(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBooking($input: CreateBookingInput!) {\n    createBooking(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DisconnectStripe {\n    disconnectStripe {\n      hasWallet\n    }\n  }\n"): (typeof documents)["\n  mutation DisconnectStripe {\n    disconnectStripe {\n      hasWallet\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation HostListing($input: HostListingInput!) {\n    hostListing(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation HostListing($input: HostListingInput!) {\n    hostListing(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LogIn($input: LogInInput) {\n    logIn(input: $input) {\n      id\n      token\n      avatar\n      hasWallet\n      didRequest\n    }\n  }\n"): (typeof documents)["\n  mutation LogIn($input: LogInInput) {\n    logIn(input: $input) {\n      id\n      token\n      avatar\n      hasWallet\n      didRequest\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LogOut {\n    logOut {\n      id\n      token\n      avatar\n      hasWallet\n      didRequest\n    }\n  }\n"): (typeof documents)["\n  mutation LogOut {\n    logOut {\n      id\n      token\n      avatar\n      hasWallet\n      didRequest\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AuthUrl {\n    authUrl\n  }\n"): (typeof documents)["\n  query AuthUrl {\n    authUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Listing($id: ID!, $bookingsPage: Int!, $limit: Int!) {\n    listing(id: $id) {\n      id\n      title\n      description\n      image\n      host {\n        id\n        name\n        avatar\n        hasWallet\n      }\n      type\n      address\n      city\n      bookings(limit: $limit, page: $bookingsPage) {\n        total\n        result {\n          id\n          tenant {\n            id\n            name\n            avatar\n          }\n          checkIn\n          checkOut\n        }\n      }\n      bookingsIndex\n      price\n      numOfGuests\n    }\n  }\n"): (typeof documents)["\n  query Listing($id: ID!, $bookingsPage: Int!, $limit: Int!) {\n    listing(id: $id) {\n      id\n      title\n      description\n      image\n      host {\n        id\n        name\n        avatar\n        hasWallet\n      }\n      type\n      address\n      city\n      bookings(limit: $limit, page: $bookingsPage) {\n        total\n        result {\n          id\n          tenant {\n            id\n            name\n            avatar\n          }\n          checkIn\n          checkOut\n        }\n      }\n      bookingsIndex\n      price\n      numOfGuests\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Listings(\n    $location: String\n    $filter: ListingsFilter!\n    $limit: Int!\n    $page: Int!\n  ) {\n    listings(location: $location, filter: $filter, limit: $limit, page: $page) {\n      region\n      total\n      result {\n        id\n        title\n        image\n        address\n        price\n        numOfGuests\n      }\n    }\n  }\n"): (typeof documents)["\n  query Listings(\n    $location: String\n    $filter: ListingsFilter!\n    $limit: Int!\n    $page: Int!\n  ) {\n    listings(location: $location, filter: $filter, limit: $limit, page: $page) {\n      region\n      total\n      result {\n        id\n        title\n        image\n        address\n        price\n        numOfGuests\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query User($id: ID!, $bookingsPage: Int!, $listingsPage: Int!, $limit: Int!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      contact\n      hasWallet\n      income\n      bookings(limit: $limit, page: $bookingsPage) {\n        total\n        result {\n          id\n          listing {\n            id\n            title\n            image\n            address\n            price\n            numOfGuests\n          }\n          checkIn\n          checkOut\n        }\n      }\n      listings(limit: $limit, page: $listingsPage) {\n        total\n        result {\n          id\n          title\n          image\n          address\n          price\n          numOfGuests\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query User($id: ID!, $bookingsPage: Int!, $listingsPage: Int!, $limit: Int!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      contact\n      hasWallet\n      income\n      bookings(limit: $limit, page: $bookingsPage) {\n        total\n        result {\n          id\n          listing {\n            id\n            title\n            image\n            address\n            price\n            numOfGuests\n          }\n          checkIn\n          checkOut\n        }\n      }\n      listings(limit: $limit, page: $listingsPage) {\n        total\n        result {\n          id\n          title\n          image\n          address\n          price\n          numOfGuests\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;