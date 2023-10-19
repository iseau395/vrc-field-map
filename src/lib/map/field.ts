import { draw_objects, update_objects } from "./objects/object";
import type { Input } from "./constants";
import { game_type, grid_enabled, is_skills } from "../../stores/settings";
import { inch_pixel_ratio, field_side } from "./constants";
import { Path } from "./paths/path";
import { GameType, type Game } from "./games/game";
import { save_state } from "./saving";

let redraw_background = true;

let field_x = window.innerWidth / 2 - field_side * inch_pixel_ratio / 2;
let field_y = window.innerHeight / 2 - field_side * inch_pixel_ratio / 2;
let field_scale = 1;

let grid_on = false;
grid_enabled.subscribe(g =>
    grid_on = g
);

const grid_scale = 48;
const grid_spacing = field_side * inch_pixel_ratio / grid_scale;

export function translate_cords(x: number, y: number) {
    return {
        x: (x - field_x) / field_scale,
        y: (y - field_y) / field_scale
    };
}

let last_mouse_x: number;
let last_mouse_y: number;
let last_scale = field_scale;
export function update_field(input: Input) {
    if (!last_mouse_x || !last_mouse_y) {
        last_mouse_x = input.mouse_x;
        last_mouse_y = input.mouse_y;
    }

    if (input.mouse_button == 1 || (input.mouse_button == 0 && input.keys.get("Alt"))) {
        field_x += input.mouse_x - last_mouse_x;
        field_y += input.mouse_y - last_mouse_y;

        redraw_background = true;
    }

    field_scale = input.wheel * -1;
    field_scale = Math.min(Math.max(.75, field_scale), 5);

    if (last_scale - field_scale != 0) {
        field_x -= ((field_side * inch_pixel_ratio * field_scale) - (field_side * inch_pixel_ratio * last_scale)) *
            ((input.mouse_x - field_x) / last_scale / inch_pixel_ratio / 144);
        field_y -= ((field_side * inch_pixel_ratio * field_scale) - (field_side * inch_pixel_ratio * last_scale)) *
            ((input.mouse_y - field_y) / last_scale / inch_pixel_ratio / 144);
        redraw_background = true;
    }

    const translated_cords = translate_cords(
        input.mouse_x,
        input.mouse_y
    );

    const transated_input = {
        ...input,
        mouse_x: translated_cords.x,
        mouse_y: translated_cords.y,
        gridless_mouse_x: translated_cords.x,
        gridless_mouse_y: translated_cords.y
    };

    if (grid_on) {
        transated_input.mouse_x = Math.round(transated_input.mouse_x / grid_spacing) * grid_spacing;
        transated_input.mouse_y = Math.round(transated_input.mouse_y / grid_spacing) * grid_spacing;
    }

    update_objects(transated_input);

    if (input.keys.get("Alt") || input.mouse_button == 1) {
        set_cursor("move");
    }

    if (field_scale < last_scale)
        set_cursor("zoom-out");
    else if (field_scale > last_scale)
        set_cursor("zoom-in");

    last_scale = field_scale;

    last_mouse_x = input.mouse_x;
    last_mouse_y = input.mouse_y;
}

let game_type_value = undefined;
let is_skills_value = undefined;
game_type.subscribe(v => game_type_value = v);
is_skills.subscribe(v => is_skills_value = v);

let game_loaded = false;
// eslint-disable-next-line no-async-promise-executor
export let game: Promise<Game> = new Promise<Game>(async (resolve) => {
    let value: Game | undefined;

    switch (game_type_value) {
        case GameType.OverUnder: {
            value = new (await import("./games/over-under/over-under")).OverUnder(is_skills_value);
        } break;
        case GameType.SpinUp: {
            value = new (await import("./games/spin-up/spin-up")).SpinUp(is_skills_value);
        } break;
    }

    if (!value) return;

    save_state();
    game_loaded = true;

    resolve(value);
});

export const path = new Path();

export const cache_scale = 3;
const bg_cache = document.createElement("canvas");
bg_cache.width = field_side * inch_pixel_ratio * cache_scale;
bg_cache.height = field_side * inch_pixel_ratio * cache_scale;

async function init_field_load(ctx: CanvasRenderingContext2D) {
    ctx.scale(cache_scale, cache_scale);

    ctx.fillStyle = "#777777";
    ctx.fillRect(0, 0, field_side * inch_pixel_ratio, field_side * inch_pixel_ratio);

    ctx.beginPath();
    for (let i = 1; i < 6; i++) {
        ctx.moveTo((field_side * inch_pixel_ratio * i) / 6, 0);
        ctx.lineTo((field_side * inch_pixel_ratio * i) / 6, field_side * inch_pixel_ratio);
    }
    for (let i = 1; i < 6; i++) {
        ctx.moveTo(0, (field_side * inch_pixel_ratio * i) / 6);
        ctx.lineTo(field_side * inch_pixel_ratio, (field_side * inch_pixel_ratio * i) / 6);
    }
    ctx.lineWidth = 1 * inch_pixel_ratio;
    ctx.strokeStyle = "#7C7C7C";
    ctx.stroke();

    (await game).draw_static(ctx);

    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 10 * inch_pixel_ratio;
    ctx.beginPath();
    ctx.rect(ctx.lineWidth / -2, ctx.lineWidth / -2, field_side * inch_pixel_ratio + ctx.lineWidth, field_side * inch_pixel_ratio + ctx.lineWidth);
    ctx.stroke();
}

let init_load = false;
export async function draw_field_bg(ctx: CanvasRenderingContext2D) {
    if (!init_load) {
        await init_field_load(bg_cache.getContext("2d") as CanvasRenderingContext2D);
        init_load = true;
    }

    ctx.drawImage(bg_cache,
        field_x, field_y,
        field_side * inch_pixel_ratio * field_scale,
        field_side * inch_pixel_ratio * field_scale
    );
}

export function draw_field(fg_ctx: CanvasRenderingContext2D, bg_ctx: CanvasRenderingContext2D, draw_background: boolean) {
    if ((redraw_background || draw_background) && game_loaded) {
        bg_ctx.fillStyle = "#505050";
        bg_ctx.fillRect(0, 0, bg_ctx.canvas.width, bg_ctx.canvas.height);

        draw_field_bg(bg_ctx);
        redraw_background = false;
    }

    fg_ctx.clearRect(0, 0, fg_ctx.canvas.width, fg_ctx.canvas.height);

    fg_ctx.save();
    fg_ctx.translate(field_x, field_y);
    fg_ctx.scale(field_scale, field_scale);

    if (grid_on) {
        fg_ctx.beginPath();

        for (let i = 1; i < grid_scale; i++) {
            fg_ctx.moveTo(i * grid_spacing, 0);
            fg_ctx.lineTo(i * grid_spacing, field_side * inch_pixel_ratio);
        }
        for (let i = 1; i < grid_scale; i++) {
            fg_ctx.moveTo(0, i * grid_spacing);
            fg_ctx.lineTo(field_side * inch_pixel_ratio, i * grid_spacing);
        }

        fg_ctx.strokeStyle = "#99999955";
        fg_ctx.lineWidth = .25 * inch_pixel_ratio;
        fg_ctx.stroke();
    }

    draw_objects(fg_ctx);

    fg_ctx.restore();
}

let new_cursor = "default";
export function check_cursor(fg_canvas: HTMLCanvasElement) {
    fg_canvas.style.cursor = new_cursor;
    new_cursor = "default";
}

export function set_cursor(cursor: string) {
    new_cursor = cursor;
}

export async function reset() {
    path.reset();
    (await game).delete();
    
    game_loaded = false;
    // eslint-disable-next-line no-async-promise-executor
    game = new Promise<Game>(async (resolve) => {
        let value: Game | undefined;

        switch (game_type_value) {
            case GameType.OverUnder: {
                value = new (await import("./games/over-under/over-under")).OverUnder(is_skills_value);
            } break;
            case GameType.SpinUp: {
                value = new (await import("./games/spin-up/spin-up")).SpinUp(is_skills_value);
            } break;
        }

        if (!value) return;

        save_state();

        bg_cache.getContext("2d").scale(1/cache_scale, 1/cache_scale);
        game_loaded = true;
        init_load = false;
        redraw_background = true;

        resolve(value);
    });
}