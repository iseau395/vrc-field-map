import type { Game } from "./games/game";
import { draw_objects, update_objects } from "./objects/object";
import type { Path } from "./paths/path";
import type { Input } from "./types";

export const inch_pixel_ratio = 5;
export const field_side = 144;

let redraw_background = false;

let field_x = 100;
let field_y = 100;
let field_scale = 1;

let last_mouse_x: number;
let last_mouse_y: number;
let last_field_x = field_x;
let last_field_y = field_y;
let last_scale = field_scale;
export function update_field(input: Input) {
    if (!last_mouse_x || !last_mouse_y) {
        last_mouse_x = input.mouse_x;
        last_mouse_y = input.mouse_y;
    }

    if (input.mouse_button == 1) {
        field_x += input.mouse_x - last_mouse_x;
        field_y += input.mouse_y - last_mouse_y;

        redraw_background = true;
    }

    field_scale = input.wheel * -1;
    field_scale = Math.min(Math.max(.75, field_scale), 4);

    if (last_scale - field_scale != 0) {
        field_x -= ((field_side * inch_pixel_ratio * field_scale) - (field_side * inch_pixel_ratio * last_scale)) *
                    ((input.mouse_x - field_x) / last_scale / inch_pixel_ratio / 144);
        field_y -= ((field_side * inch_pixel_ratio * field_scale) - (field_side * inch_pixel_ratio * last_scale)) *
                    ((input.mouse_y - field_y) / last_scale / inch_pixel_ratio / 144);
        redraw_background = true;
    }

    last_scale = field_scale;

    last_mouse_x = input.mouse_x;
    last_mouse_y = input.mouse_y;

    last_field_x = field_x;
    last_field_y = field_y;

    const transated_input = {
        ...input,
        mouse_x: (input.mouse_x - field_x) / field_scale,
        mouse_y: (input.mouse_y - field_y) / field_scale,
    };

    update_objects(transated_input);
}

const game = new Promise<Game>(async resolve => {
    resolve(new (await import("./games/spin-up/spin-up")).SpinUp());
});

const path = new Promise<Path>(async resolve => {
    resolve(new (await import("./paths/path")).Path());
});

export async function draw_field_bg(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(field_x, field_y);
    ctx.scale(field_scale, field_scale);

    ctx.fillStyle = "#777777";
    ctx.fillRect(0, 0, field_side * inch_pixel_ratio, field_side * inch_pixel_ratio);

    ctx.beginPath();
    for (let i = 1; i < 6; i++) {
        ctx.moveTo((field_side * inch_pixel_ratio * i) / 6, 0);
        ctx.lineTo((field_side * inch_pixel_ratio * i) / 6, field_side * inch_pixel_ratio);
    }
    for (let i = 1; i < 6; i++) {
        ctx.moveTo(0,                             (field_side * inch_pixel_ratio * i) / 6);
        ctx.lineTo(field_side * inch_pixel_ratio, (field_side * inch_pixel_ratio * i) / 6);
    }
    ctx.lineWidth = 1 * inch_pixel_ratio;
    ctx.strokeStyle = "#7C7C7C"
    ctx.stroke();

    (await game).draw_static(ctx);

    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 10 * inch_pixel_ratio;
    ctx.beginPath();
    ctx.rect(ctx.lineWidth / -2, ctx.lineWidth / -2, field_side * inch_pixel_ratio + ctx.lineWidth, field_side * inch_pixel_ratio + ctx.lineWidth);
    ctx.stroke();

    ctx.restore();
}

export function draw_field(fg_ctx: CanvasRenderingContext2D, bg_ctx: CanvasRenderingContext2D, draw_background: boolean) {
    if (redraw_background || draw_background) {
        bg_ctx.fillStyle = "#505050";
        bg_ctx.fillRect(0, 0, bg_ctx.canvas.width, bg_ctx.canvas.height);

        draw_field_bg(bg_ctx);
        redraw_background = false;
    }

    fg_ctx.clearRect(0, 0, fg_ctx.canvas.width, fg_ctx.canvas.height);

    fg_ctx.save();
    fg_ctx.translate(field_x, field_y);
    fg_ctx.scale(field_scale, field_scale);

    draw_objects(fg_ctx);

    fg_ctx.restore();
}