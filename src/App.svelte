<script>
  import http from "./helpers/RequestHelper";
  import OperationDocsHelper from "./helpers/OperationDocsHelper";
  import { pokemons, isAuthenticated, token } from "./store";
  import { onMount } from "svelte";
  import auth from "./authService";

  let auth0Client;

  token.subscribe(async (value) => {
    if (value !== "") {
      const { pokemons: myPokemons } = await http.startFetchMyQuery(
        OperationDocsHelper.getAllPokemons(),
      );
      pokemons.set(myPokemons);
    }
  });

  onMount(async () => {
    auth0Client = await auth.createClient();
    isAuthenticated.set(await auth0Client.isAuthenticated());
    const accessToken = await auth0Client.getIdTokenClaims();
    if (accessToken) {
      token.set(accessToken.__raw);
    }
  });

  function login() {
    auth.loginWithPopup(auth0Client);
  }

  function logout() {
    auth.logout(auth0Client);
  }

  const addPokemon = async () => {
    const name = prompt("Enter name: ") || "";
    const ability = prompt("Enter ability: ") || "";
    await http.startExecuteMyMutation(
      OperationDocsHelper.addOnePokemon(name, ability),
    );
    pokemons.update((n) => [...n, { name, ability }]);
  };

  const deletePokemon = async () => {
    const name = prompt("Enter name to delete: ") || "";
    await http.startExecuteMyMutation(
      OperationDocsHelper.deletePokemonsByName(name),
    );
    pokemons.update((n) => n.filter((item) => item.name !== name));
  };
</script>

<main>
  {#if !$isAuthenticated}
    <button on:click={login}>Log in</button>
  {:else}
    <button on:click={logout}>Log out</button>
    <button on:click={addPokemon}>Add pokemon</button>
    <button on:click={deletePokemon}>Delete pokemon</button>
    <table border="1">
      <thead>
        <th>name</th>
        <th>ability</th>
      </thead>
      <tbody>
        {#each $pokemons as pokemon}
          <tr>
            <th>{pokemon.name}</th>
            <th>{pokemon.ability}</th>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  main {
    margin: 0;
  }
</style>
