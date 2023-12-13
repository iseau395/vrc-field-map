import { field_side, inch_pixel_ratio } from "../../constants";
import { register_insert_option } from "../../../context_menu/context_menu";
import type { Game } from "../game";
import { Triball } from "./triball";
import { save_state, saveable, saveable_off } from "../../saving";

@saveable("overunder")
export class OverUnder implements Game {
    objects: Triball[];

    constructor(is_skills: boolean) {
        register_insert_option({
            name: "Triball",
            on_select: (x, y) => {
                this.objects.push(new Triball(x / inch_pixel_ratio, y / inch_pixel_ratio));

                save_state();
            }
        });

        this.place_objects(is_skills);
    }

    private place_objects(is_skills: boolean) {
        if (!is_skills) {
            this.objects = [
                new Triball(5.41, 5.41, 90),
                new Triball(field_side - 5.41, 5.41, 180),
                new Triball(5.41, field_side - 5.41),
                new Triball(field_side - 5.41, field_side - 5.41, 270),

                new Triball(field_side / 3, field_side / 2, 90),
                new Triball(field_side / 2 - 4, field_side / 2, 270),
                new Triball(field_side / 2 - 4, field_side / 3, 90),

                new Triball(field_side / 3 * 2, field_side / 2, 270),
                new Triball(field_side / 2 + 4, field_side / 2, 90),
                new Triball(field_side / 2 + 4, field_side / 3 * 2, 270),

                new Triball(field_side / 2, field_side / 12, 90),
                new Triball(field_side / 2, field_side / 12 * 11, 270),
            ];
        } else {
            this.objects = [
                new Triball(5.41, 5.41, 90),
                new Triball(field_side - 5.41, 5.41, 180),
                new Triball(5.41, field_side - 5.41),
                new Triball(field_side - 5.41, field_side - 5.41, 270),

                new Triball(field_side / 3, field_side / 2, 180),

                new Triball(field_side / 2 - 4, field_side / 6 + 4, 180),
                new Triball(field_side / 2 - 4, field_side / 3, 180),
                new Triball(field_side / 2 - 4, field_side / 2, 180),
                new Triball(field_side / 2 - 4, field_side / 3 * 2, 180),
                new Triball(field_side / 2 - 4, field_side / 6 * 5 - 4, 180),

                new Triball(field_side / 2, field_side / 12, 90),
                new Triball(field_side / 2, field_side / 12 * 11, 270),
            ];
        }
    }

    save() {
        function round(value: number) {
            return Math.round(value * 100) / 100;
        }

        let data = "";

        for (const object of this.objects) {
            data += `${round(object.x / inch_pixel_ratio)},${round(object.y / inch_pixel_ratio)},${round(object.rotation / Math.PI * 180)};`;
        }

        return data.slice(0, -1);
    }

    load(raw_data: string) {
        for (const object of this.objects) {
            object.delete();
        }
        this.objects.length = 0;

        if (!raw_data) return;

        const data = raw_data.split(";");

        for (const encoded_segment of data) {
            const point = encoded_segment.split(",");

            this.objects.push(new Triball(+point[0], +point[1], +point[2]));
        }
    }

    draw_static(ctx: CanvasRenderingContext2D): void {
        const side = field_side * inch_pixel_ratio;
        const pipe_diameter = 2.38 * inch_pixel_ratio;

        ctx.lineCap = "square";

        // Tape
        ctx.beginPath();
        ctx.moveTo(0, side / 12 * 7);
        ctx.lineTo(side / 2, side / 12 * 7);

        ctx.moveTo(0, side / 2 - inch_pixel_ratio);
        ctx.lineTo(side, side / 2 - inch_pixel_ratio);
        ctx.moveTo(0, side / 2 + inch_pixel_ratio);
        ctx.lineTo(side, side / 2 + inch_pixel_ratio);

        ctx.moveTo(side / 2, side / 12 * 5);
        ctx.lineTo(side, side / 12 * 5);

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = inch_pixel_ratio / 2;
        ctx.stroke();

        // Red Tubes
        ctx.beginPath();

        ctx.moveTo(side / 6, 0);
        ctx.lineTo(0, side / 6);

        ctx.moveTo(0, side / 6 * 5);
        ctx.lineTo(side / 6, side);

        ctx.moveTo(side / 2, side / 6 * 5);
        ctx.lineTo(side / 2, side);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = pipe_diameter;
        ctx.stroke();
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = pipe_diameter - inch_pixel_ratio / 2;
        ctx.stroke();

        // Blue Tubes
        ctx.beginPath();

        ctx.moveTo(side / 2, 0);
        ctx.lineTo(side / 2, side / 6);

        ctx.moveTo(side / 6 * 5, 0);
        ctx.lineTo(side, side / 6);

        ctx.moveTo(side, side / 6 * 5);
        ctx.lineTo(side / 6 * 5, side);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = pipe_diameter;
        ctx.stroke();
        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = pipe_diameter - inch_pixel_ratio / 2;
        ctx.stroke();

        // Barrier
        ctx.lineCap = "round";
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
        ctx.beginPath();
        ctx.arc(side / 2, side / 6, pipe_diameter / 2, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#FFFF00";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio / 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(side / 2, side / 6 * 5, pipe_diameter / 2, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#FFFF00";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio / 4;
        ctx.stroke();

        // Goals

        ctx.lineWidth = 1 * inch_pixel_ratio;
        const goal_net_gap = 1.5 * inch_pixel_ratio;

        // Red Goal

        ctx.beginPath();
        ctx.arc(side / 6 * 5, side / 3, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio / 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(side / 6 * 5, side / 3 * 2, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio / 4;
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(side, side / 3);
        ctx.lineTo(side / 6 * 5, side / 3);
        ctx.lineTo(side / 6 * 5, side / 3 * 2);
        ctx.lineTo(side, side / 3 * 2);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1 * inch_pixel_ratio;
        ctx.stroke();
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 1 * inch_pixel_ratio - inch_pixel_ratio / 2;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 11; i++) {
            const x = side / 6 * 5 + side / 6 / 11 * i;

            ctx.moveTo(x, side / 3 + goal_net_gap);
            ctx.lineTo(x, side / 3 * 2 - goal_net_gap);
        }
        for (let i = 0; i < 20; i++) {
            const y = (side / 3) + (side / 3 - goal_net_gap * 2) / 20 * i + goal_net_gap;

            ctx.moveTo(side / 6 * 5, y);
            ctx.lineTo(side, y);
        }
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = .1 * inch_pixel_ratio;
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(side, side / 3 + goal_net_gap);
        ctx.lineTo(side / 6 * 5, side / 3 + goal_net_gap);
        ctx.lineTo(side / 6 * 5, side / 3 * 2 - goal_net_gap);
        ctx.lineTo(side, side / 3 * 2 - goal_net_gap);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1 * inch_pixel_ratio;
        ctx.stroke();

        // Blue Goal

        ctx.beginPath();
        ctx.arc(side / 6, side / 3, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio / 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(side / 6, side / 3 * 2, 4.315 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = inch_pixel_ratio / 4;
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(0, side / 3);
        ctx.lineTo(side / 6, side / 3);
        ctx.lineTo(side / 6, side / 3 * 2);
        ctx.lineTo(0, side / 3 * 2);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1 * inch_pixel_ratio;
        ctx.stroke();
        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = 1 * inch_pixel_ratio - inch_pixel_ratio / 2;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 11; i++) {
            const x = side / 6 / 11 * i;

            ctx.moveTo(x, side / 3 + goal_net_gap);
            ctx.lineTo(x, side / 3 * 2 - goal_net_gap);
        }
        for (let i = 0; i < 20; i++) {
            const y = (side / 3) + (side / 3 - goal_net_gap * 2) / 20 * i + goal_net_gap;

            ctx.moveTo(0, y);
            ctx.lineTo(side / 6, y);
        }
        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = .1 * inch_pixel_ratio;
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(0, side / 3 + goal_net_gap);
        ctx.lineTo(side / 6, side / 3 + goal_net_gap);
        ctx.lineTo(side / 6, side / 3 * 2 - goal_net_gap);
        ctx.lineTo(0, side / 3 * 2 - goal_net_gap);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1 * inch_pixel_ratio;
        ctx.stroke();

    }

    delete() {
        for (const object of this.objects) {
            object.delete();
        }
        this.objects.length = 0;

        saveable_off(this);
    }
}