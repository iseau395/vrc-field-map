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
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        this.points.forEach(p => {
            ctx.lineTo(p.x, p.y);
        });
        
        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.stroke();
    }
}