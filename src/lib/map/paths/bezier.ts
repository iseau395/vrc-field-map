import { inch_pixel_ratio } from "../constants";
import { on_event, off } from "../objects/object";
import { Point } from "./point";

export class BezierCurve {
    points: [Point, Point, Point, Point];

    private render_id: number;

    constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
        this.points = [
            new Point(x1, y1),
            new Point(x2, y2),
            new Point(x3, y3),
            new Point(x4, y4)
        ];

        for (const point of this.points) {
            point.subscribe(() => this.notify());
        }

        this.render_id = on_event("postrender", (ctx: CanvasRenderingContext2D) => this.render(ctx));
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.bezierCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y);

        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "butt";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[1].x, this.points[1].y);
        ctx.moveTo(this.points[2].x, this.points[2].y);
        ctx.lineTo(this.points[3].x, this.points[3].y);

        ctx.setLineDash([10]);
        ctx.strokeStyle = "#DD0000";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "butt";
        ctx.stroke();
        ctx.setLineDash([]);
    }

    readonly subscribers = [];
    subscribe(callback: (point: Point) => void) {
        callback(this);

        this.subscribers.push(callback);

        const subscriber = this.subscribers.length - 1;

        return () => {
            this.subscribers.splice(subscriber, 1);
        };
    }

    notify() {
        for (const callback of this.subscribers) {
            callback(this);
        };
    }

    delete() {
        off("postrender", this.render_id);

        for (const point of this.points) {
            point.delete();
        }
    }
}