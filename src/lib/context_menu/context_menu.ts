import { inch_pixel_ratio } from "../map/field";

export type ContextMenuOption = {
    name: string,
} & ({
    sub_options?: ContextMenuOption[];
} | {
    on_select: (x: number, y: number) => void;
});

export const options: ContextMenuOption[] = [
    {
        name: "Insert",
        options: []
    },
    {
        name: "Copy Cords",
        on_select: (x, y) => navigator.clipboard.writeText(`${x / inch_pixel_ratio}, ${y / inch_pixel_ratio}`)
    }
];

export function register_insert_option(data: ContextMenuOption) {
    options[0].options.push(data);
}