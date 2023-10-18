import { inch_pixel_ratio } from "../constants";
import { collisioncircle, dragable, object, on, remove_callbacks } from "../objects/object";

@object
@collisioncircle(0, 0, 1.5 * inch_pixel_ratio)
@dragable
export class Point {
    x: number;
    y: number;

    hidden = false;

    constructor(x: number, y: number) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;
    }

    @on("postrender")
    render(ctx: CanvasRenderingContext2D) {
        if (this.hidden) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, 1 * inch_pixel_ratio, 0, 2 * Math.PI);

        ctx.fillStyle = "#DD0000";
        ctx.fill();
    }

    private readonly subscribers: ((point: Point) => void)[] = [];
    subscribe(callback: (point: Point) => void) {
        callback(this);

        const index = this.subscribers.push(callback) - 1;

        return () => {
            this.subscribers.splice(index, 1);
        };
    }

    notify() {
        for (const callback of this.subscribers) {
            callback(this);
        }
    }

    delete() {
        remove_callbacks(this);
    }
}
