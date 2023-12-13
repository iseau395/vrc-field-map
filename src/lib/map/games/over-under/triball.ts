import { inch_pixel_ratio } from "../../constants";
import { cache_scale } from "../../field";
import { object, on, dragable, remove_callbacks, clear_collision, add_circle_collision } from "../../objects/object";

const radius = 3.5 * inch_pixel_ratio;

@object
// @collisioncircle(0, 0, radius)
@dragable
export class Triball {
    public x: number;
    public y: number;
    public rotation: number;

    static triball_cache = document.createElement("canvas");
    static triball_cache_ctx: CanvasRenderingContext2D | null = null;

    constructor(x: number, y: number, rotation = 0) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;
        this.rotation = rotation * Math.PI / 180;

        add_circle_collision(this as any, 0, 0, radius);
    }

    @on("render") 
    render(ctx: CanvasRenderingContext2D) {
        if (!Triball.triball_cache_ctx) {
            Triball.triball_cache.width = radius*cache_scale*2 + inch_pixel_ratio/4 * cache_scale;
            Triball.triball_cache.height = radius*cache_scale*2 + inch_pixel_ratio/4 * cache_scale;
            Triball.triball_cache_ctx = Triball.triball_cache.getContext("2d") as CanvasRenderingContext2D;

            const deg_120 = (120 * Math.PI) / 180;
    
            Triball.triball_cache_ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const x = radius * cache_scale + radius * Math.cos(i * deg_120) * cache_scale;
                const y = radius * cache_scale + radius * Math.sin(i * deg_120) * cache_scale;
                Triball.triball_cache_ctx.arc(x, y, 6.1 * inch_pixel_ratio * cache_scale, i * deg_120 + deg_120*1.25, i * deg_120 - deg_120*1.25);
            }
            Triball.triball_cache_ctx.closePath();
    
            Triball.triball_cache_ctx.strokeStyle = "#000000";
            Triball.triball_cache_ctx.lineWidth = inch_pixel_ratio/4 * cache_scale;
            Triball.triball_cache_ctx.fillStyle = "#00FF00";
            Triball.triball_cache_ctx.fill();
            Triball.triball_cache_ctx.stroke();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(Triball.triball_cache, -radius, -radius, radius * 2, radius * 2);
        ctx.restore();
    }

    delete() {
        remove_callbacks(this);
        clear_collision(this);
    }
}