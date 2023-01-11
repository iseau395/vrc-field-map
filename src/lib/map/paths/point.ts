import { inch_pixel_ratio } from "../field";
import { collisioncircle, dragable, object, on } from "../objects/object";

@object
@collisioncircle(0, 0, 1.5 * inch_pixel_ratio)
@dragable
export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;
    }

    @on("postrender")
    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1 * inch_pixel_ratio, 0, 2 * Math.PI);

        ctx.fillStyle = "#DD0000";
        ctx.fill();
    }
}