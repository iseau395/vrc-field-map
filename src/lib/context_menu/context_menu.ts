export type Option = {
    name: string,
} & ({
    sub_options?: Option[];
} | {
    on_select: (x: number, y: number) => void;
})

export const options: Option[] = [{
    name: "Test",
    options: [{
        name: "Test",
        on_select: () => { console.log("test"); }
    }]
}, {
    name: "Test",
    on_select: () => { console.log("test"); }
}, {
    name: "Test",
    on_select: () => { console.log("test"); }
}, {
    name: "Test",
    on_select: () => { console.log("test"); }
}];