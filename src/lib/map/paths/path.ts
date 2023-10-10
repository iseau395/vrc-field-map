import { inch_pixel_ratio } from "../constants";
import { on_event } from "../objects/object";
import { Point } from "./point";
import { register_insert_option } from "../../context_menu/context_menu";
import { BezierCurve } from "./bezier";

export class Path {
    path: (Point | BezierCurve)[] = [];

    constructor() {
        register_insert_option({
            name: "Point",
            on_select: (x, y) => {
                this.add_segment(new Point(x / inch_pixel_ratio, y / inch_pixel_ratio));
            }
        });

        register_insert_option({
            name: "Bézier Curve",
            on_select: (x, y) => {
                x /= inch_pixel_ratio;
                y /= inch_pixel_ratio;

                if (this.path.length == 0) {
                    this.add_segment(new Point(x, y));
                }

                this.add_segment(new BezierCurve(x, y, x, y - 15, x + 20, y - 15, x + 20, y));
            }
        });

        on_event("postrender", (ctx: CanvasRenderingContext2D) => this.render(ctx));
        on_event("update", () => this.update());
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "butt";

        for (let i = 0; i < this.path.length - 1; i++) {
            ctx.beginPath();

            const path_segment = this.path[i];
            const next_segment = this.path[i + 1];

            if ("points" in path_segment && "points" in next_segment) {
                ctx.moveTo(path_segment.points[3].x, path_segment.points[3].y);
                ctx.lineTo(next_segment.points[0].x, next_segment.points[0].y);
            } else if ("points" in path_segment && !("points" in next_segment)) {
                ctx.moveTo(path_segment.points[3].x, path_segment.points[3].y);
                ctx.lineTo(next_segment.x, next_segment.y);
            } else if (!("points" in path_segment) &&"points" in next_segment) {
                ctx.moveTo(path_segment.x, path_segment.y);
                ctx.lineTo(next_segment.points[0].x, next_segment.points[0].y);
            } else if (!("points" in path_segment) && !("points" in next_segment)) {
                ctx.moveTo(path_segment.x, path_segment.y);
                ctx.lineTo(next_segment.x, next_segment.y);
            }
            ctx.stroke();
        }
    }

    update() {
        for (let i = 1; i < this.path.length; i++) {
            let path_segment = this.path[i];
            let last_path_segment = this.path[i-1];

            if ("points" in path_segment) {
                if ("points" in last_path_segment) {
                    path_segment.points[0].x = last_path_segment.points[3].x;
                    path_segment.points[0].y = last_path_segment.points[3].y;
                } else {
                    path_segment.points[0].x = last_path_segment.x;
                    path_segment.points[0].y = last_path_segment.y;
                }
            }
        }
    }

    private readonly callbacks = [];
    subscribe(callback: (path: Path) => void) {
        callback(this);

        const index = this.callbacks.push(callback) - 1;

        return () => {
            this.callbacks.splice(index, 1);
        };
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

    add_segment(segment: Point | BezierCurve) {
        this.path.push(segment);

        this.notify();
    }
}
