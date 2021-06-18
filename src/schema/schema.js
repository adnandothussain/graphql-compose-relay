/* @flow */

import { schemaComposer } from "graphql-compose";
import data from "../mock/data";

const AuthorTC = schemaComposer.createObjectTC({
  name: "Author",
  fields: {
    id: "Int!",
    firstName: "String",
    lastName: "String",
  },
});

const PostTC = schemaComposer.createObjectTC({
  name: "Post",
  fields: {
    id: "Int!",
    title: "String",
    votes: "Int",
    authorId: "Int",
  },
});

PostTC.addFields({
  author: {
    // you may provide type name as string 'Author',
    // but for better developer experience use Type instance `AuthorTC`
    // it allows to jump to type declaration via Ctrl+Click in your IDE
    type: AuthorTC,
    // resolve method as first argument will receive data for some Post
    // from this data you should somehow fetch Author's data
    // let's take lodash `find` method, for searching by `authorId`
    // PS. `resolve` method may be async for fetching data from DB
    // resolve: async (source, args, context, info) => { return DB.find(); }
    resolve: (post) =>
      data.authors.find((author) => author.id === post.authorId),
  },
});

AuthorTC.addFields({
  posts: {
    // Array of posts may be described as string in SDL in such way '[Post]'
    // But graphql-compose allow to use Type instance wrapped in array
    type: [PostTC],
    // for obtaining list of post we get current author.id
    // and scan and filter all Posts with desired authorId
    resolve: (author) =>
      data.posts.filter((post) => post.authorId === author.id),
  },
  postCount: {
    type: "Int",
    description: "Number of Posts written by Author",
    resolve: (author) =>
      data.posts.filter((post) => post.authorId === author.id).length,
  },
});

schemaComposer.Query.addFields({
  posts: {
    type: "[Post]",
    resolve: () => data.posts, // resolve the posts from the db
  },
  author: {
    type: "Author",
    args: { id: "Int!" },
    // resolve the author from the db
    resolve: (_, { id }) => data.authors.find((author) => author.id === id),
  },
});

// Requests which modify data put into Mutation
schemaComposer.Mutation.addFields({
  addPost: {
    type: "Post",
    args: {
      title: "String",
      votes: "Int",
      authorId: "Int",
    },
    resolve: (_, args) => {
      const newPost = { ...args, id: data.posts.length + 1 };
      data.posts.push(newPost);
      return newPost;
    },
  },
});

// And now buildSchema which will be passed to express-graphql or apollo-server
export default schemaComposer.buildSchema();
