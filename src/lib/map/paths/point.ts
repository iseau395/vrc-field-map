import { inch_pixel_ratio } from "../constants";
import { collisioncircle, dragable, object, on, remove_callbacks } from "../objects/object";

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
        remove_callbacks(this);
    }
}