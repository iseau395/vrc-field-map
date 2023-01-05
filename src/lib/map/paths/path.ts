import { inch_pixel_ratio } from "../field";
import { object, on } from "../objects/object";
import { Point } from "./point";

@object
export class Path {
    readonly points = [
        new Point(0, 10),
        new Point(10, 10),
        new Point(20, 10),
        new Point(30, 10),
        new Point(40, 10),
    ]

    @on("postrender")
    render(ctx: CanvasRenderingContext2D) {
        
        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "butt";

        for (let i = 0; i < this.points.length-1; i++) {
            ctx.beginPath();
            ctx.moveTo(this.points[i].x, this.points[i].y);
            ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
            ctx.stroke();
        }
    }
}