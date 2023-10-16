import { inch_pixel_ratio } from "../../constants";
import { cache_scale } from "../../field";
import { object, collisioncircle, on, dragable } from "../../objects/object";

const radius = 3.5 * inch_pixel_ratio;

const triball_cache = document.createElement("canvas");
let triball_cache_ctx: CanvasRenderingContext2D | null = null;
triball_cache.width = radius*cache_scale*2;
triball_cache.height = radius*cache_scale*2;

@object
@collisioncircle(0, 0, radius)
@dragable
export class Triball {
    public x: number;
    public y: number;
    public rotation: number;

    constructor(x: number, y: number, rotation = 0) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;
        this.rotation = rotation * Math.PI / 180;
    }

    @on("render") 
    render(ctx: CanvasRenderingContext2D) {
        if (!triball_cache_ctx) {
            triball_cache_ctx = triball_cache.getContext("2d") as CanvasRenderingContext2D;

            const deg_120 = (120 * Math.PI) / 180;
    
            triball_cache_ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const x = radius * cache_scale + radius * Math.cos(this.rotation + i * deg_120) * cache_scale;
                const y = radius * cache_scale + radius * Math.sin(this.rotation + i * deg_120) * cache_scale;
                triball_cache_ctx.arc(x, y, 6.1 * inch_pixel_ratio * cache_scale, this.rotation + i * deg_120 + deg_120*1.25, this.rotation + i * deg_120 - deg_120*1.25);
            }
            triball_cache_ctx.closePath();
    
            triball_cache_ctx.strokeStyle = "#000000";
            triball_cache_ctx.lineWidth = inch_pixel_ratio/4 * cache_scale;
            triball_cache_ctx.fillStyle = "#00FF00";
            triball_cache_ctx.fill();
            triball_cache_ctx.stroke();
        }

        ctx.drawImage(triball_cache, this.x - radius, this.y - radius, radius * 2, radius * 2);
    }
}