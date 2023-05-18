import { inch_pixel_ratio } from "../../constants";
import { object, collisioncircle, on, dragable } from "../../objects/object";

const radius = 3.5 * inch_pixel_ratio;

@object
@collisioncircle(0, 0, radius)
@dragable
export class Triball {
    public x: number;
    public y: number;
    public rotation: number

    constructor(x: number, y: number, rotation: number = 0) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;
        this.rotation = rotation * Math.PI / 180;
    }

    @on("render") 
    render(ctx: CanvasRenderingContext2D) {
        const deg_120 = (120 * Math.PI) / 180;

        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const x = this.x + radius * Math.cos(this.rotation + i * deg_120);
            const y = this.y + radius * Math.sin(this.rotation + i * deg_120);
            ctx.arc(x, y, 6.1 * inch_pixel_ratio, this.rotation + i * deg_120 + deg_120*1.25, this.rotation + i * deg_120 - deg_120*1.25);
        }
        ctx.closePath();

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio/4;
        ctx.fillStyle = "#00FF00";
        ctx.fill();
        ctx.stroke();
    }
}