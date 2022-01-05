import { writable } from "svelte/store";

export const pokemons = writable([]);
export const token = writable("");
export const isAuthenticated = writable(false);
export const user = writable({});
export const popupOpen = writable(false);
export const error = writable();
export const counter = writable(0);
