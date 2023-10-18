import { inch_pixel_ratio } from "../constants";
import { on_event } from "../objects/object";
import { Point } from "./point";
import { register_insert_option } from "../../context_menu/context_menu";
import { BezierCurve } from "./bezier";
import { save_state, saveable } from "../saving";

@saveable("path")
export class Path {
    path: (Point | BezierCurve)[] = [];

    constructor() {
        register_insert_option({
            name: "Point",
            on_select: (x, y) => {
                this.add_segment(new Point(x / inch_pixel_ratio, y / inch_pixel_ratio));

                save_state();
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

                save_state();
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
            const path_segment = this.path[i];
            const last_path_segment = this.path[i-1];

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

    save() {
        if (this.path.length == 0) return "";

        let data = "";

        function round(value: number) {
            return Math.round(value * 100) / 100;
        }

        for (let i = 0; i < this.path.length; i++) {
            const path_segment = this.path[i];

            if ("points" in path_segment) {
                data += "b";
                // data += `${round(path_segment.points[0].x)},${round(path_segment.points[0].y)},`;
                data += `${round(path_segment.points[1].x)},${round(path_segment.points[1].y)},`;
                data += `${round(path_segment.points[2].x)},${round(path_segment.points[2].y)},`;
                data += `${round(path_segment.points[3].x)},${round(path_segment.points[3].y)}`;
            } else {
                data += `p${round(path_segment.x)},${round(path_segment.y)}`;
            }

            if (i != this.path.length - 1)
                data += ";";
        }

        return data;
    }

    load(data_string: string) {
        const data = data_string.split(";");

        for (const segment of this.path) {
            segment.delete();
        }
        this.path.length = 0;

        if (data.length == 0) {
            return;
        }
        
        for (let i = 0; i < data.length; i++) {
            let encoded_segment = data[i];

            if (encoded_segment.startsWith("b")) {
                encoded_segment = encoded_segment.substring(1);

                const points = encoded_segment.split(",");

                this.path.push(new BezierCurve(
                    0,
                    0,
                    +points[0] / inch_pixel_ratio,
                    +points[1] / inch_pixel_ratio,
                    +points[2] / inch_pixel_ratio,
                    +points[3] / inch_pixel_ratio,
                    +points[4] / inch_pixel_ratio,
                    +points[5] / inch_pixel_ratio
                ));
            } else if (encoded_segment.startsWith("p")) {
                encoded_segment = encoded_segment.substring(1);

                const point = encoded_segment.split(",");

                this.path.push(new Point(+point[0] / inch_pixel_ratio, +point[1] / inch_pixel_ratio));
            }
        }

        this.notify();
    }

    private readonly callbacks: ((path: Path) => void)[] = [];
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

    reset() {
        for (const segment of this.path) {
            segment.delete();
        }
        this.path.length = 0;

        this.notify();
    }
}
