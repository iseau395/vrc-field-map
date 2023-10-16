
type SaveFunc = () => string;
type LoadFunc = (data: string) => void;
interface Saveable {
    save: SaveFunc;
    load: LoadFunc;
}

const save_callbacks: SaveFunc[] = [];
const load_callbacks: LoadFunc[] = [];
export function saveable<T extends (new (...args: any[]) => Saveable)>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            save_callbacks.push(() => this.save());
            load_callbacks.push((data: string) => this.load(data));
        }
    };
}

export function saveable_off<T extends Saveable>(object: T) {
    const save_index = save_callbacks.indexOf(object.save);
    
    if (save_index != -1) {
        save_callbacks.splice(save_index, 1);
    }

    const load_index = load_callbacks.indexOf(object.load);
    
    if (load_index != -1) {
        load_callbacks.splice(load_index, 1);
    }
}

const before_load_callbacks: (() => void)[] = [];
export function before_load(callback: () => void) {
    before_load_callbacks.push(callback);
}

export function get_save_state() {
    let data = "";

    for (let i = 0; i < save_callbacks.length; i++) {
        data += save_callbacks[i]();

        if (i != save_callbacks.length - 1)
            data += "|";
    }

    return data;
}

export function load_save_state(raw_data: string) {
    const data = raw_data.split("|");

    for (const callback of before_load_callbacks) {
        (() => {
            callback();
        })();
    }

    for (let i = 0; i < load_callbacks.length; i++) {
        load_callbacks[i](data[i]);
    }
}


const undo_states: string[] = [];
const redo_states: string[] = [];
let skip_cache = false;
let first_cache = false;

export function cache_undo_state() {
    if (skip_cache) {
        skip_cache = false;
        return;
    }
    
    first_cache = true;

    const save_state = get_save_state();

    if (save_state != undo_states.at(-1)) {
        undo_states.push(save_state);

        if (undo_states.length > 25) {
            undo_states.shift();
        }

        redo_states.length = 0;
        redo_states.push(save_state);
    }
}

export function undo() {
    if (undo_states.length <= 1 || !first_cache) {
        return;
    }

    load_save_state(undo_states.at(-2) as string);
    redo_states.push(undo_states.at(-2) as string);
    undo_states.pop();

    skip_cache = true;
}

export function redo() {
    if (redo_states.length <= 1 || !first_cache) {
        return;
    }

    load_save_state(redo_states.at(-2) as string);
    undo_states.push(redo_states.at(-2) as string);
    redo_states.pop();

    skip_cache = true;
}