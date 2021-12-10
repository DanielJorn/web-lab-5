export default class OperationDocsHelper {
  static getAllPokemons() {
    return `
    query MyQuery {
          pokemons {
            name
            id
            ability
          }
        }`;
  }
  static addOnePokemon(name, ability) {
    return `
    mutation MyMutation {
      insert_pokemons_one(object: {ability: "${ability}", name: "${name}"}) {
        ability
        name
      }
    }
    `;
  }
  static deletePokemonsByName(name) {
    return `
    mutation MyMutation {
      delete_pokemons(where: {name: {_eq: "${name}"}}) {
        affected_rows
      }
    }
    `;
  }
}
