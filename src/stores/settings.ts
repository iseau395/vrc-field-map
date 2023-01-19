import { writable } from "svelte/store";

export const settings_screen_visible = writable<boolean>(false);
export const grid_enabled = writable<boolean>(false);