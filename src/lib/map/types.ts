export interface Input {
    mouse_x: number;
    mouse_y: number;
    gridless_mouse_x: number;
    gridless_mouse_y: number;
    mouse_button: -1 | 0 | 1 | 2;
    mouse_button_changed: boolean;
    wheel: number;
    keys: Map<string, boolean | null>;
}