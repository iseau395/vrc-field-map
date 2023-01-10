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
    }
];

export function register_insert_option(data: ContextMenuOption) {
    options[0].options.push(data);
}