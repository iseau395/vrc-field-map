import { inch_pixel_ratio } from "../constants";
import { on_event } from "../objects/object";
import { Point } from "./point";
import { register_insert_option } from "../../context_menu/context_menu";
import { BezierCurve } from "./bezier";

export class Path {
    readonly path: (Point | BezierCurve)[] = [];

    constructor() {
        register_insert_option({
            name: "Point",
            on_select: (x, y) => {
                this.path.push(new Point(x / inch_pixel_ratio, y / inch_pixel_ratio));

                this.notify();
            }
        });

        register_insert_option({
            name: "Bézier Curve",
            on_select: (x, y) => {
                x /= inch_pixel_ratio;
                y /= inch_pixel_ratio;

                this.path.push(new BezierCurve(x, y, x, y - 15, x + 20, y - 15, x + 20, y));

                this.notify();
            }
        });

        on_event("postrender", (ctx: CanvasRenderingContext2D) => this.render(ctx));
    }

    render(ctx: CanvasRenderingContext2D) {

        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "butt";

        for (let i = 0; i < this.path.length - 1; i++) {
            ctx.beginPath();

            const path_segment = this.path[i];
            const next_segment = this.path[i + 1];

            if (is_bezier(path_segment) && is_bezier(next_segment)) {
                ctx.moveTo(path_segment.points[3].x, path_segment.points[3].y);
                ctx.lineTo(next_segment.points[0].x, next_segment.points[0].y);
            } else if (is_bezier(path_segment) && is_point(next_segment)) {
                ctx.moveTo(path_segment.points[3].x, path_segment.points[3].y);
                ctx.lineTo(next_segment.x, next_segment.y);
            } else if (is_point(path_segment) && is_bezier(next_segment)) {
                ctx.moveTo(path_segment.x, path_segment.y);
                ctx.lineTo(next_segment.points[0].x, next_segment.points[0].y);
            } else if (is_point(path_segment) && is_point(next_segment)) {
                ctx.moveTo(path_segment.x, path_segment.y);
                ctx.lineTo(next_segment.x, next_segment.y);
            }
            ctx.stroke();
        }
    }

    private readonly callbacks = [];
    subscribe(callback) {
        callback(this);

        const index = this.callbacks.push(callback) - 1;

        return () => {
            this.callbacks.splice(index, 1);
        }
    }

    notify() {
        this.callbacks.forEach(c => c(this));
    }

    remove_segment(index: number) {
        this.path[index].delete();
        this.path.splice(index, 1);
        this.notify();
    }

    move_segment(old_index: number, new_index: number) {
        this.path.splice(new_index, 0, this.path.splice(old_index, 1)[0]);
        this.notify();
    }
}

export function is_bezier<T extends (Point | Bezier)>(path_segment: T): T extends Bezier ? true : false {
    return "points" in path_segment;
}

export function is_point<T extends (Point | Bezier)>(path_segment: T): T extends Point ? true : false {
    return !("points" in path_segment);
}