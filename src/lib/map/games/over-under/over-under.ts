import { field_side, inch_pixel_ratio } from "../../constants";
import { register_insert_option } from "../../../context_menu/context_menu";
import type { Game } from "../game";
import { Triball } from "./triball";

export class OverUnder implements Game {
    readonly objects = [
        new Triball(5.41, 5.41, 90),
        new Triball(field_side - 5.41, 5.41, 180),
        new Triball(5.41, field_side - 5.41),
        new Triball(field_side - 5.41, field_side - 5.41, 270),
        
        new Triball(field_side / 3, field_side / 2, 90),
        new Triball(67, field_side / 2, 270),
        new Triball(67, field_side / 3, 90),

        new Triball(field_side / 3 * 2, field_side / 2, 270),
        new Triball(76, field_side / 2, 90),
        new Triball(76, field_side / 3 * 2, 270),

        new Triball(field_side / 2, field_side / 12, 90),
        new Triball(field_side / 2, field_side / 12 * 11, 270),
    ];

    constructor() {
        register_insert_option({
            name: "Triball",
            on_select: (x, y) =>
                this.objects.push(new Triball(x/inch_pixel_ratio, y/inch_pixel_ratio))
        });
    }

    draw_static(ctx: CanvasRenderingContext2D): void {
        const side = field_side * inch_pixel_ratio;
        const pipe_diameter = 2.38 * inch_pixel_ratio;

        ctx.lineWidth = pipe_diameter;
        ctx.lineCap = "round";

        // Red Tubes
        ctx.strokeStyle = "#FF0000";

        ctx.beginPath();

        ctx.moveTo(side / 6, 0);
        ctx.lineTo(0, side / 6);

        ctx.moveTo(0, side / 6 * 5);
        ctx.lineTo(side / 6, side);

        ctx.moveTo(side / 2, side / 6 * 5);
        ctx.lineTo(side / 2, side);

        ctx.stroke();

        // Blue Tubes
        ctx.strokeStyle = "#0000FF";

        ctx.beginPath();

        ctx.moveTo(side / 2, 0);
        ctx.lineTo(side / 2, side / 6);

        ctx.moveTo(side / 6 * 5, 0);
        ctx.lineTo(side, side / 6);

        ctx.moveTo(side, side / 6 * 5);
        ctx.lineTo(side / 6 * 5, side);

        ctx.stroke();

        // Barrier
        ctx.strokeStyle = "#000000";

        ctx.beginPath();

        ctx.moveTo(side / 2, side / 6);
        ctx.lineTo(side / 2, side / 6 * 5);

        ctx.moveTo(side / 3, side / 6);
        ctx.lineTo(side / 3 * 2, side / 6);

        ctx.moveTo(side / 3, side / 6 * 5);
        ctx.lineTo(side / 3 * 2, side / 6 * 5);

        ctx.stroke();

        // Yellow Caps
        ctx.fillStyle = "#FFFF00";

        ctx.beginPath();

        ctx.arc(side / 2, side / 6, pipe_diameter / 2, 0, Math.PI * 2);
        ctx.arc(side / 2, side / 6 * 5, pipe_diameter / 2, 0, Math.PI * 2);

        ctx.closePath();
        ctx.fill();

        // Goals

        ctx.lineWidth = 1 * inch_pixel_ratio;

        // Red Goal
        ctx.strokeStyle = "#FF0000";
        ctx.fillStyle = "#FF0000";

        ctx.beginPath();

        ctx.moveTo(side, side / 3);
        ctx.lineTo(side / 6 * 5, side / 3);
        ctx.lineTo(side / 6 * 5, side / 3 * 2);
        ctx.lineTo(side, side / 3 * 2);

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(side / 6 * 5, side / 3, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.arc(side / 6 * 5, side / 3 * 2, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);

        ctx.closePath()
        ctx.fill();

        // Blue Goal
        ctx.strokeStyle = "#0000FF";
        ctx.fillStyle = "#0000FF";

        ctx.beginPath();

        ctx.moveTo(0, side / 3);
        ctx.lineTo(side / 6, side / 3);
        ctx.lineTo(side / 6, side / 3 * 2);
        ctx.lineTo(0, side / 3 * 2);

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(side / 6, side / 3, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.arc(side / 6, side / 3 * 2, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);

        ctx.closePath()
        ctx.fill();
    }
}