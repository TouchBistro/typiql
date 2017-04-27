/* globals it, describe, afterEach */
/* eslint-disable import/no-extraneous-dependencies */

import { expect } from 'chai'
import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql'

import tql from '../src/typiql'

describe('typiql', () => {
  const parsesScalar = (scalarName, type) => {
    it(`parses ${scalarName}`, () => {
      expect(tql([scalarName])).to.eq(type)
    })
  }

  parsesScalar('ID', GraphQLID)
  parsesScalar('Int', GraphQLInt)
  parsesScalar('String', GraphQLString)
  parsesScalar('Float', GraphQLFloat)
  parsesScalar('Boolean', GraphQLBoolean)

  const throwsWhen = (f) => {
    it('throws exception on invalid input', () => {
      expect(f).to.throw(Error)
    })
  }

  throwsWhen(() => tql`[]`)
  throwsWhen(() => tql`[`)
  throwsWhen(() => tql`Int!!`)
  throwsWhen(() => tql`!Int`)
  throwsWhen(() => tql`   Int`)

  // BUG: below should throw
  // throwsWhen(() => tql`Int]`)

  it('fails to parse multiple interpolated types', () => {
    expect(() => tql`${GraphQLBoolean}${GraphQLBoolean}`).to.throw(Error, /invalid/)
  })

  it('fails to parse unknown scalars', () => {
    expect(() => tql`Dog`).to.throw(Error)
  })

  const expectSameTypes = (a, b) => {
    expect(a instanceof GraphQLList).to.eq(b instanceof GraphQLList)
    expect(a instanceof GraphQLNonNull).to.eq(b instanceof GraphQLNonNull)
    if (b.ofType) {
      expectSameTypes(a.ofType, b.ofType)
    }
  }

  it('parses lists', () => {
    expectSameTypes(tql`[Boolean]`, new GraphQLList(GraphQLBoolean))
  })

  it('parses non nulls', () => {
    expectSameTypes(tql`Int!`, new GraphQLNonNull(GraphQLInt))
  })

  it('parses multiple modifiers', () => {
    expectSameTypes(
        tql`[Int!]!`,
        new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
    )
    expectSameTypes(
        tql`[Int]!`,
        new GraphQLNonNull(new GraphQLList(GraphQLInt)),
    )
    expectSameTypes(
        tql`[Int!]`,
        new GraphQLList(new GraphQLNonNull(GraphQLInt)),
    )
  })

  it('parses interpolated custom types', () => {
    const FoodType = new GraphQLObjectType({
      name: 'Food',
      fields: {
        delicious: { type: GraphQLBoolean },
      },
    })
    expectSameTypes(tql`${FoodType}!`, new GraphQLNonNull(FoodType))
  })
})
