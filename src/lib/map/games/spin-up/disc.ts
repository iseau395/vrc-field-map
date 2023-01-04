import { inch_pixel_ratio } from "../../field";
import type { Input } from "../../types";
import { object, collisioncircle, on, dragable } from "../../objects/object";

const radius = 5.5/2 * inch_pixel_ratio;

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
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);

        ctx.fillStyle = "#FFFF00";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, radius/1.4, 0, 2 * Math.PI);

        ctx.fillStyle = "#DDDD00";
        ctx.fill();
    }
}