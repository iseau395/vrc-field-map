import { inch_pixel_ratio } from "../../constants";
import { cache_scale } from "../../field";
import { object, on, dragable, add_circle_collision, remove_callbacks, clear_collision } from "../../objects/object";

const radius = 5.5/2 * inch_pixel_ratio;
const disc_cache = document.createElement("canvas");
let disc_cache_ctx: CanvasRenderingContext2D | null = null;
disc_cache.width = radius*cache_scale*2;
disc_cache.height = radius*cache_scale*2;

@object
// @collisioncircle(0, 0, radius)
@dragable
export class Disc {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;

        add_circle_collision(this as any, 0, 0, radius);
    }

    @on("render")
    public render(ctx: CanvasRenderingContext2D) {
        if (!disc_cache_ctx) {
            disc_cache_ctx = disc_cache.getContext("2d") as CanvasRenderingContext2D;

            disc_cache_ctx.beginPath();
            disc_cache_ctx.arc(radius * cache_scale, radius * cache_scale, radius * cache_scale, 0, 2 * Math.PI);
    
            disc_cache_ctx.fillStyle = "#FFFF00";
            disc_cache_ctx.fill();
    
            disc_cache_ctx.beginPath();
            disc_cache_ctx.arc(radius * cache_scale, radius * cache_scale, (radius * cache_scale)/1.4, 0, 2 * Math.PI);

            disc_cache_ctx.fillStyle = "#DDDD00";
            disc_cache_ctx.fill();

        }

        ctx.scale(1/cache_scale, 1/cache_scale);
        ctx.drawImage(disc_cache, (this.x - radius) * cache_scale, (this.y - radius) * cache_scale, radius * cache_scale * 2, radius * cache_scale * 2);
        ctx.scale(cache_scale, cache_scale);
    }

    delete() {
        remove_callbacks(this);
        clear_collision(this);
    }
}