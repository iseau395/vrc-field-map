
type SaveFunc = () => string;
type LoadFunc = (data: String) => void;
interface Saveable {
    save: SaveFunc;
    load: LoadFunc;
}

const save_callbacks: SaveFunc[] = [];
const load_callbacks: LoadFunc[] = [];
export function saveable<T extends new (...args: any[]) => Saveable>(Base: T) {
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

    for (let i = 0; i < load_callbacks.length; i++) {
        load_callbacks[i](data[i]);
    }
}