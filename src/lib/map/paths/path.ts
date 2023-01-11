import { inch_pixel_ratio } from "../field";
import { object, on } from "../objects/object";
import { Point } from "./point";
import { register_insert_option } from "../../context_menu/context_menu";
import { BezierCurve } from "./bezier";

@object
export class Path {
    readonly path: (Point|BezierCurve)[] = [];

    constructor() {
        register_insert_option({
            name: "Point",
            on_select: (x, y) =>
                this.path.push(new Point(x/inch_pixel_ratio, y/inch_pixel_ratio))
        });

        register_insert_option({
            name: "Bézier Curve",
            on_select: (x, y) => {
                x /= inch_pixel_ratio;
                y /= inch_pixel_ratio;

                this.path.push(new BezierCurve(x, y, x, y-15, x+20, y-15, x+20, y));
            }
        })
    }

    @on("postrender")
    render(ctx: CanvasRenderingContext2D) {
        
        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "butt";

        for (let i = 0; i < this.path.length-1; i++) {
            ctx.beginPath();
            ctx.moveTo(this.path[i].x, this.path[i].y);
            ctx.lineTo(this.path[i+1].x, this.path[i+1].y);
            ctx.stroke();
        }
    }
}