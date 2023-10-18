import { writable } from "svelte/store";
import { game_type, is_skills } from "../../stores/settings";

const SAVE_VERSION = 0;

type SaveFunc = () => string;
type LoadFunc = (data: string) => void;
interface Saveable {
    save_id?: string;

    save: SaveFunc;
    load: LoadFunc;
}

const save_callbacks = new Map<string, SaveFunc>();
const load_callbacks = new Map<string, LoadFunc>();
export function saveable<T extends (new (...args: any[]) => Saveable)>(save_id: string) {
    return (Base: T) => {
        return class extends Base {
            save_id = save_id;

            constructor(...args: any[]) {
                super(...args);
    
                save_callbacks.set(save_id, () => this.save());
                load_callbacks.set(save_id, (data: string) => this.load(data));
            }
        };
    };
}

export function saveable_off<T extends Saveable>(object: T) {
    if (object.save_id) {
        save_callbacks.delete(object.save_id);
        load_callbacks.delete(object.save_id);
    }
}

const before_load_callbacks: (() => void)[] = [];
export function before_load(callback: () => void) {
    before_load_callbacks.push(callback);
}

let game_type_value = undefined;
let is_skills_value = undefined;
game_type.subscribe(v => game_type_value = v);
is_skills.subscribe(v => is_skills_value = v);

export function get_save_state() {
    let data = `${SAVE_VERSION},${game_type_value},${is_skills_value ? 1 : 0}`;

    save_callbacks.forEach((callback, save_id) => {
        data += `|${save_id}:${callback()}`;
    });

    data.slice(0, -1);

    return data;
}

export function load_save_state(raw_data: string) {
    const data = raw_data.split("|");

    const metadata = data.shift().split(",");

    game_type.set(+metadata[1]);
    is_skills.set(+metadata[2] == 1);

    for (const callback of before_load_callbacks) {
        (() => {
            callback();
        })();
    }

    console.log(load_callbacks);
    console.log(raw_data);

    for (const data_segment of data) {
        const [id, raw_data] = data_segment.split(":");

        const callback = load_callbacks.get(id);

        if (callback) {
            callback(raw_data);
        }
    }
}

export function save_as(id: string) {
    save_to_local_storage(get_save_state(), id);
}

export const current_save_id = writable<string | undefined>();
let current_save_id_value: string | undefined;
current_save_id.subscribe((v) => {
    current_save_id_value = v;
});

function save_to_local_storage(state: string, new_id?: string) {
    const id = new_id ?? current_save_id_value;

    if (id) {
        id.replace("|", "");

        const save_list = localStorage.getItem("save-list");
        if (save_list) {
            const save_ids = save_list.split("|");
    
            if (!save_ids.includes(id)) {
                save_ids.push(id);
            }

            localStorage.setItem("save-list", save_ids.join("|"));
        } else {
            localStorage.setItem("save-list", id);
        }

        localStorage.setItem(`file-${id}`, state);
    }
}


const undo_states: string[] = [];
const redo_states: string[] = [];
let skip_cache = false;
let first_cache = false;

export function save_state() {
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

        save_to_local_storage(save_state);
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