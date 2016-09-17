# typiql

![Circle CI](https://circleci.com/gh/touchbistro/typiql/tree/master.svg?style=shield)](https://circleci.com/gh/touchbistro/typiql/tree/master)

**typiql** is a micro-helper for [graphql-js](https://github.com/graphql/graphql-js) that lets you refer to your GraphQL types more succinctly.

typiql is not for building entire schemas. It's only for use with the `type` property of your GraphQL fields. You still define `GraphQLObjectType` and `GraphQLInputObjectType`s with normal `graphql-js` syntax, but when declaring your fields' types, use `tql` shorthand to refer to scalars, custom objects, and wrapping types.

## Examples

**Built in scalars**

```js
tql`String`     // => GraphQLString
tql`Int`        // => GraphQLInt
```

**Non-null scalar**
```js
tql`ID!`        // => new GraphQLNonNull(GraphQLID)
```

**Non-null list of non-null floats**
```js
tql`[Float!]!`  // => new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLFloat)))
```

**List of custom object types**
```js
tql`[${BeerType}]` // => new GraphQLList(BeerType)
```

## Detailed example

```
npm install --save typiql
```

```js
import tql from 'typiql'
import {
  GraphQLObjectType
} from 'graphql'

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => {
    id: { type: tql`ID!` },          // => new GraphQLNonNull(GraphQLID)
    text: { type: tql`String!` },    // => new GraphQLNonNull(GraphQLString)
    post: {
      type: tql`${PostType}!`,       // => new GraphQLNonNull(PostType)
      resolve: () => { /* ... */ }
    }
  }
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => {
    id: { type: tql`ID!` },           // => new GraphQLNonNull(GraphQLID)
    title: { type: tql`String!` },    // => new GraphQLNonNull(GraphQLString)
    comments: {
      type: tql`[${CommentType}!]`,   // => new GraphQLNonNull(new GraphQLList(CommentType))
      resolve: () => { /* ... */ }
    }
  }
})
```

## Notes

* typiql is **not intended** for constructing your entire schema using the GraphQL schema IDL. For this, [consider one of the other tools listed here](https://github.com/apollostack/graphql-syntax).

* typiql does not require/implement a custom type registry. Import your actual types, and interpolate them.

* typiql gives you a slightly better experience than stock `graphql-js`, while still allowing you to build your schema programatically, as well as keep your resolvers next to your fields. (typiql does not require your types and resolvers in separate parallel structures, like some other schema building tools).
