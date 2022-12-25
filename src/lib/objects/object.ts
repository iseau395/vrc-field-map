import type { Input } from "../types";

const callbacks: { [K in keyof Events]: Map<number, Events[K]> } = {
    render: new Map(),
    postrender: new Map(),
    update: new Map()
};

const objects = new Map<number, any>();

// Decorators

const callback_symbol = Symbol("ObjectCallbacks");
const id_symbol = Symbol("ObjectID");

let current_id = 0;

export function object<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            this[id_symbol] = current_id++;

            objects.set(this[id_symbol], this);

            const object_callbacks = Base.prototype[callback_symbol];

            if (object_callbacks) {
                object_callbacks.forEach((value: (...args: any[]) => void, key: string) => {
                    callbacks[key].set(this[id_symbol], (ctx) =>
                        value.apply(this, [ctx]));
                });
            }
        }
    }
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
        if (!target.prototype[collision_symbol])
            target.prototype[collision_symbol] = [];

        target.prototype[collision_symbol].push([CollisionType.BOX, x_offset, y_offset, width, height]);
    };
}
export function collisioncircle(x_offset: number, y_offset: number, radius: number) {
    return function (target: any) {
        if (!target.prototype[collision_symbol])
            target.prototype[collision_symbol] = [];

        target.prototype[collision_symbol].push([CollisionType.CIRCLE, x_offset, y_offset, radius]);
    };
}

// Misc

export function in_collision<T>(object: T, x: number, y: number) {
    x -= object["x"];
    y -= object["y"];

    for (const collision of object[collision_symbol]) {
        if (collision[0] == CollisionType.BOX) {
            if (collision[1] < x && collision[2] < y &&
                collision[1] + collision[3] > x &&
                collision[2] + collision[4] > y) {
                return true
            }
        }
    
        if (collision[0] == CollisionType.CIRCLE) {
            if ((x - collision[1])**2 + (y - collision[2])**2 < collision[3]**2) {
                return true;
            }
        }
    }

    return false;
}

export let selection = -1;

export function dragable<T extends new (...args: any[]) => { [callback_symbol]?: Map<string, Events[keyof Events]>, [collision_symbol]?: Collision[], x: number, y: number }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            if (!this[callback_symbol])
                this[callback_symbol] = new Map<string, Events[keyof Events]>();

            const update_func = this[callback_symbol].get("update") as Events["update"];

            this[callback_symbol].set("update", (input: Input) => {
                if (selection == -1 && input.mouse_button == 0 && this[collision_symbol]) {

                    if (in_collision(this, input.mouse_x, input.mouse_y))
                        selection = this[id_symbol];
                }

                if (update_func)
                    update_func(input);
            });
        }
    }
}

// Events

interface Events {
    render: (ctx: CanvasRenderingContext2D) => void;
    postrender: (ctx: CanvasRenderingContext2D) => void;
    update: (input: Input) => void;
}

export function on<E extends keyof Events>(event: E) {
    return (target: any, _, descriptor: TypedPropertyDescriptor<Events[E]>) => {
        if (!target[callback_symbol])
            target[callback_symbol] = new Map<string, Events[keyof Events]>();

        target[callback_symbol].set(event, descriptor.value);
    }
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
        const selected_object = objects.get(selection);

        selected_object.x = input.mouse_x;
        selected_object.y = input.mouse_y;

        objects.set(selection, selected_object);
    } else if (input.mouse_button != 0) {
        selection = -1;
    }

    callbacks.update.forEach(callback => {
        callback(input);
    });
}