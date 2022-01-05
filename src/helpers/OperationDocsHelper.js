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
        id
      }
    }
    `;
  }
  static deletePokemonsById(id) {
    return `
    mutation MyMutation {
      delete_pokemons(where: {id: {_eq: "${id}"}}) {
        affected_rows
      }
    }
    `;
  }
}
