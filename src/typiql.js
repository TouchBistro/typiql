import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql'

const scalars = {
  ID: GraphQLID,
  Int: GraphQLInt,
  String: GraphQLString,
  Float: GraphQLFloat,
  Boolean: GraphQLBoolean,
}

const modifiers = {
  '!': GraphQLNonNull,
  ']': GraphQLList,
}

const resolveConcreteType = ({ prefix, suffix, type }) => {
  const invalidChars = [
    prefix.replace(/[\[]/g, ''),
    suffix.replace(/[!\]]/g, ''),
  ].join('')

  if (invalidChars.length > 0) {
    throw new Error(`invalid modifier character ${invalidChars}`)
  }

  const wrapInModifier = (modifierType, char) => {
    const ModifierType = modifiers[char]
    return new ModifierType(modifierType)
  }

  return suffix.split('').reverse().reduce(wrapInModifier, type)
}

const typiql = (strings, ...types) => {
  const isScalar = (types.length === 0 && strings.length === 1)
  const isConcreteType = (types.length === 1 && strings.length === 2)

  if (isScalar) {
    const scalarName = strings[0].replace(/[\[\]!]/g, '')
    const scalar = scalars[scalarName]
    if (scalar == null) {
      throw new Error(`unrecognized scalar ${scalarName}`)
    }
    // Call typiql again with the concrete type of the scalar
    const [prefix, suffix] = strings[0].split(/[^\[\]!]+/g)
    return resolveConcreteType({
      prefix,
      suffix,
      type: scalar,
    })
  } else if (isConcreteType) {
    return resolveConcreteType({
      prefix: strings[0],
      suffix: strings[1],
      type: types[0],
    })
  }

  throw new Error('invalid template string format')
}

export default typiql
