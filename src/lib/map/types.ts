export interface Input {
    mouse_x: number;
    mouse_y: number;
    mouse_button: -1 | 0 | 1 | 2;
    wheel: number;
    keys: Map<string, boolean | null>;
}