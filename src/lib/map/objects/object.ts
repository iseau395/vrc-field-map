import type { Input } from "../constants";
import { set_cursor } from "../field";

export type Callbacks = {
    [K in keyof Events]: Map<number, Events[K]>
};

const callbacks: Callbacks = {
    render: new Map<number, Events["render"]>(),
    postrender: new Map<number, Events["postrender"]>(),
    update: new Map<number, Events["update"]>()
};

type MapObject = { x: number, y: number, hidden?: boolean, [id_symbol]?: number, notify?: () => void };

const objects = new Map<number, MapObject>();

// Decorators

export const callback_symbol = Symbol("ObjectCallbacks");
export const id_symbol = Symbol("ObjectID");

let current_id = 1;

export function reset_objects() {
    current_id = 1;
    objects.clear();

    for (const event in callbacks) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callbacks[event].clear();
    }
}

export function object<T extends { new(...args: any[]): MapObject }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            this[id_symbol] = current_id++;
            (this as any)[callback_symbol] = (this as any)[callback_symbol] ?? Base.prototype[callback_symbol] ?? Base.prototype.prototype[callback_symbol];
            (this as any)[collision_symbol] = (this as any)[collision_symbol] ?? Base.prototype[collision_symbol] ?? Base.prototype.prototype[collision_symbol];

            objects.set(this[id_symbol], this);

            const object_callbacks: Map<keyof Events, Events[keyof Events]> | undefined = Base.prototype[callback_symbol];

            if (object_callbacks) {
                object_callbacks.forEach((value: (...args: any[]) => void, key: keyof Events) => {
                    callbacks[key].set(this[id_symbol]!, (...params: unknown[]) =>
                        value.apply(this, params));
                });
            }
        }
    };
}

// Collsision

const collision_symbol = Symbol("CollisionBoxes");

enum CollisionType {
    BOX,
    CIRCLE
}

type Collision = [type: CollisionType.BOX, x_offset: number, y_offset: number, width: number, height: number] |
[type: CollisionType.CIRCLE, x_offset: number, y_offset: number, radius: number];

export function collisionbox(x_offset: number, y_offset: number, width: number, height: number) {
    return function (target: any) {
        add_box_collision(target.prototype, x_offset, y_offset, width, height);
    };
}
export function collisioncircle(x_offset: number, y_offset: number, radius: number) {
    return function (target: any) {
        add_circle_collision(target.prototype, x_offset, y_offset, radius);
    };
}

export function add_box_collision<T extends { [collision_symbol]: Collision[] }>(object: T, x_offset: number, y_offset: number, width: number, height: number) {
    if (!object[collision_symbol])
        object[collision_symbol] = [];

    object[collision_symbol].push([CollisionType.BOX, x_offset, y_offset, width, height]);
}
export function add_circle_collision<T extends { [collision_symbol]: Collision[] }>(object: T, x_offset: number, y_offset: number, radius: number) {
    if (!object[collision_symbol])
        object[collision_symbol] = [];

    object[collision_symbol].push([CollisionType.CIRCLE, x_offset, y_offset, radius]);
}

// Misc

export function in_collision<T extends { [collision_symbol]: Collision[] } & MapObject>(object: T, x: number, y: number) {
    x -= object["x"];
    y -= object["y"];

    for (const collision of object[collision_symbol]) {
        if (collision[0] == CollisionType.BOX) {
            if (collision[1] < x && collision[2] < y &&
                collision[1] + collision[3] > x &&
                collision[2] + collision[4] > y) {
                return true;
            }
        }

        if (collision[0] == CollisionType.CIRCLE) {
            if ((x - collision[1]) ** 2 + (y - collision[2]) ** 2 < collision[3] ** 2) {
                return true;
            }
        }
    }

    return false;
}

export function clear_collision<T extends { [collision_symbol]?: Collision[] } & MapObject>(object: T) {
    if (collision_symbol in object)
        object[collision_symbol]!.length = 0;
}

export let selection = -1;

interface Dragable extends MapObject {
    [callback_symbol]?: Map<string, Events[keyof Events]>,
    [collision_symbol]?: Collision[]
}
export function dragable<T extends new (...args: any[]) => Dragable>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            if (!this[callback_symbol])
                this[callback_symbol] = new Map<keyof Events, Events[keyof Events]>();

            const update_func = this[callback_symbol].get("update") as Events["update"];

            this[callback_symbol].set("update", (input: Input) => {
                if (this.hidden) return;

                let changed = false;

                if (selection == -1 && input.mouse_button == 0 && this[collision_symbol]) {
                    if (collision_symbol in this && in_collision(this as { [collision_symbol]: Collision[] } & typeof this, input.gridless_mouse_x, input.gridless_mouse_y) && !input.keys.get("Alt")) {
                        selection = this[id_symbol]!;

                        if (this.x != input.mouse_x || this.y != input.mouse_y)
                            changed = true;

                        this.x = input.gridless_mouse_x;
                        this.y = input.gridless_mouse_y;
                    }
                } else if (selection == -1 && this[collision_symbol]) {
                    if (in_collision(this as { [collision_symbol]: Collision[] } & typeof this, input.gridless_mouse_x, input.gridless_mouse_y) && !input.keys.get("Alt"))
                        set_cursor("grab");
                }

                if (update_func)
                    update_func(input);

                if ("notify" in this && changed)
                    this.notify!();
            });
        }
    };
}

// Events

interface Events {
    render: (ctx: CanvasRenderingContext2D) => void;
    postrender: (ctx: CanvasRenderingContext2D) => void;
    update: (input: Input) => void;
}

export function on<E extends keyof Events>(event: E) {
    return (target: { [callback_symbol]?: Map<keyof Events, Events[keyof Events]> } & MapObject, _: unknown, descriptor: TypedPropertyDescriptor<Events[E]>) => {
        if (!target[callback_symbol])
            target[callback_symbol] = new Map<keyof Events, Events[keyof Events]>();

        target[callback_symbol].set(event, descriptor.value!);
    };
}

let on_event_id = -1;
export function on_event<E extends keyof Events>(event: E, callback: Events[E]) {
    const id = on_event_id--;
    callbacks[event].set(id, callback);

    return id;
}

export function off(event: keyof Events, id: number) {
    callbacks[event].delete(id);
}

export function remove_callbacks(target: { [callback_symbol]?: Map<keyof Events, Events[keyof Events]> } & MapObject) {
    if (!target[callback_symbol] || !target[id_symbol]) return;

    target[callback_symbol].forEach((_, event) => {
        off(event, target[id_symbol]!);
    });
}

// Update functions

export function draw_objects(ctx: CanvasRenderingContext2D) {
    callbacks.render.forEach(callback => {
        callback(ctx);
    });
    callbacks.postrender.forEach(callback => {
        callback(ctx);
    });
}

export function update_objects(input: Input) {
    if (selection != -1 && input.mouse_button == 0) {
        set_cursor("grabbing");

        const selected_object = objects.get(selection)!;

        const changed = selected_object.x != input.mouse_x || selected_object.y != input.mouse_y;

        selected_object.x = input.mouse_x;
        selected_object.y = input.mouse_y;

        objects.set(selection, selected_object);

        if ("notify" in selected_object && changed)
            selected_object.notify!();
    } else if (input.mouse_button != 0) {
        selection = -1;
    }

    callbacks.update.forEach(callback => {
        callback(input);
    });
}