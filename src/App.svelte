<script>
  import http from "./helpers/RequestHelper";
  import OperationDocsHelper from "./helpers/OperationDocsHelper";
  import { pokemons, isAuthenticated, token, error, counter } from "./store";
  import { onMount } from "svelte";
  import auth from "./authService";

  let auth0Client;
  let online;
  const pokemonInfo = {};
  token.subscribe(async (value) => {
    if (value !== "") {
      try {
        const { pokemons: myPokemons } = await http.startFetchMyQuery(
          OperationDocsHelper.getAllPokemons(),
        );
        pokemons.set(myPokemons);
      } catch (e) {
        error.set(e.message);
      }
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
    const { name, ability } = pokemonInfo;
    try {
      if (!name || !ability) throw new Error("No empty");
      const { insert_pokemons_one } = await http.startExecuteMyMutation(
        OperationDocsHelper.addOnePokemon(name, ability),
      );
      pokemons.update((n) => [...n, insert_pokemons_one]);
    } catch (e) {
      $error = e.message;
    }
  };

  const deletePokemon = async (id) => {
    try {
      await http.startExecuteMyMutation(
        OperationDocsHelper.deletePokemonsById(id),
      );
      pokemons.update((n) => n.filter((item) => item.id !== id));
    } catch (e) {
      $error = e.message;
    }
  };
</script>

<svelte:window bind:online />
<main>
  {#if !online}
    <h1>Offline</h1>
  {:else if $counter}
    <h1>Loading</h1>
  {:else if $error}
    <h1>{$error}</h1>
  {:else if !$isAuthenticated}
    <button on:click={login}>Log in</button>
  {:else}
    <button on:click={logout}>Log out</button>
    <div>
      <input placeholder="Name..." bind:value={pokemonInfo.name} />
      <input placeholder="Ability..." bind:value={pokemonInfo.ability} />
      <button on:click={addPokemon}>Add pokemon</button>
    </div>
    {#if $pokemons.length}
      <table border="1">
        <thead>
          <th>name</th>
          <th>ability</th>
          <th>delete</th>
        </thead>
        <tbody>
          {#each $pokemons as pokemon (pokemon.id)}
            <tr>
              <th>{pokemon.name}</th>
              <th>{pokemon.ability}</th>
              <button on:click={() => deletePokemon(pokemon.id)}
                >Delete pokemon</button
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <h1>No pokemons!!!</h1>
    {/if}
  {/if}
</main>

<style>
  main {
    margin: 0;
  }

  tr,
  th {
    padding: 10px;
  }
</style>
