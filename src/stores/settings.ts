import { GameType } from "../lib/map/games/game";
import { writable } from "svelte/store";

export const settings_screen_visible = writable<boolean>(false);
export const grid_enabled = writable<boolean>(false);

export const is_skills = writable<boolean>(false);
export const game_type = writable<GameType>(GameType.OverUnder);