import { cache_scale, inch_pixel_ratio } from "../../field";
import { object, collisioncircle, on, dragable } from "../../objects/object";

const radius = 5.5/2 * inch_pixel_ratio;
let cached = false;
const disc_cache = document.createElement("canvas").getContext("2d");
if (disc_cache) {
    disc_cache.canvas.width = 2 * radius * cache_scale;
    disc_cache.canvas.height = 2 * radius * cache_scale;
}

@object
@collisioncircle(0, 0, radius)
@dragable
export class Disc {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;
    }

    @on("render")
    public render(ctx: CanvasRenderingContext2D) {
        if (!cached) {
            disc_cache.beginPath();
            disc_cache.arc(radius * cache_scale, radius * cache_scale, radius * cache_scale, 0, 2 * Math.PI);
    
            disc_cache.fillStyle = "#FFFF00";
            disc_cache.fill();
    
            disc_cache.beginPath();
            disc_cache.arc(radius * cache_scale, radius * cache_scale, (radius * cache_scale)/1.4, 0, 2 * Math.PI);
    
            disc_cache.fillStyle = "#DDDD00";
            disc_cache.fill();

            cached = true;
        }

        ctx.drawImage(disc_cache.canvas, this.x - radius, this.y - radius, radius * 2, radius * 2);
    }
}