import { inch_pixel_ratio } from "../map/constants";
import { settings_screen_visible } from "../../stores/settings";
import { sidebar_visible } from "../map/paths/PathSidebar.svelte";

export interface ContextMenuOptionNested {
    name: string;
    options: ContextMenuOption[];
}
export interface ContextMenuOptionCallback {
    name: string;
    on_select: (x: number, y: number) => void;
}
export type ContextMenuOption = ContextMenuOptionCallback | ContextMenuOptionNested;

export const options: ContextMenuOption[] = [
    {
        name: "Insert",
        options: []
    },
    {
        name: "Copy Cords",
        on_select: (x, y) => navigator.clipboard.writeText(`${Math.round(y / inch_pixel_ratio * 100) / 100}, ${Math.round(x / inch_pixel_ratio * 100) / 100}`)
    },
    {
        name: "Settings",
        on_select: () => settings_screen_visible.set(true)
    },
    {
        name: "Edit Path",
        on_select: () => {
            sidebar_visible.set(true);
        }
    }
];

export function register_insert_option(data: ContextMenuOptionCallback) {
    if ("options" in options[0])
        options[0].options.push(data);
}