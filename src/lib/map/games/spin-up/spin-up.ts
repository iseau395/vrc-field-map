import { field_side, inch_pixel_ratio } from "../../constants";
import type { Game } from "../game";
import { Disc } from "./disc";
import { Roller, RollerState } from "./roller";
import { register_insert_option } from "../../../context_menu/context_menu";
import { save_state, saveable, saveable_off } from "../../saving";
import { remove_callbacks } from "../../objects/object";

@saveable("spinup")
export class SpinUp implements Game {
    objects: (Disc | Roller)[];

    constructor(is_skills: boolean) {
        register_insert_option({
            name: "Disc",
            on_select: (x, y) => {
                this.objects.push(new Disc(x / inch_pixel_ratio, y / inch_pixel_ratio));

                save_state();
            }
        });

        this.place_objects(is_skills);
    }

    place_objects(is_skills: boolean) {
        this.objects = [
            new Roller(0, field_side / 6, true, RollerState.BlueRed),
            new Roller(field_side / 6, 0, false, RollerState.RedBlue),
            new Roller(field_side - 2.4, field_side / 6 * 5 - 9.8, true, RollerState.BlueRed),
            new Roller(field_side / 6 * 5 - 9.8, field_side - 2.4, false, RollerState.RedBlue),
    
            new Disc(field_side / 12 * 1, field_side / 12 * 1),
            new Disc(field_side / 12 * 2, field_side / 12 * 2),
            new Disc(field_side / 12 * 3, field_side / 12 * 3 - 1),
            new Disc(field_side / 12 * 3, field_side / 12 * 3 - 2),
            new Disc(field_side / 12 * 3, field_side / 12 * 3 - 3),
            new Disc(field_side / 12 * 4, field_side / 12 * 4),
            new Disc(field_side / 12 * 5, field_side / 12 * 5),
    
            new Disc(field_side / 12 * 7, field_side / 12 * 7),
            new Disc(field_side / 12 * 8, field_side / 12 * 8),
            new Disc(field_side / 12 * 9, field_side / 12 * 9 - 1),
            new Disc(field_side / 12 * 9, field_side / 12 * 9 - 2),
            new Disc(field_side / 12 * 9, field_side / 12 * 9 - 3),
            new Disc(field_side / 12 * 10, field_side / 12 * 10),
            new Disc(field_side / 12 * 11, field_side / 12 * 11),
    
    
            new Disc(field_side / 12 * 5, field_side / 12 * 3),
            new Disc(field_side / 12 * 6, field_side / 12 * 4),
            new Disc(field_side / 12 * 7, field_side / 12 * 5),
    
            new Disc(field_side / 12 * 9, field_side / 12 * 7 - 1),
            new Disc(field_side / 12 * 9, field_side / 12 * 7 - 2),
            new Disc(field_side / 12 * 9, field_side / 12 * 7 - 3),
    
    
            new Disc(field_side / 12 * 5, field_side / 12 * 7),
            new Disc(field_side / 12 * 6, field_side / 12 * 8),
            new Disc(field_side / 12 * 7, field_side / 12 * 9),
    
            new Disc(field_side / 12 * 3, field_side / 12 * 5 - 1),
            new Disc(field_side / 12 * 3, field_side / 12 * 5 - 2),
            new Disc(field_side / 12 * 3, field_side / 12 * 5 - 3),
    
            new Disc(field_side / 48 * 31, field_side / 48 * 9),
            new Disc(field_side / 48 * 31, field_side / 48 * 12),
            new Disc(field_side / 48 * 31, field_side / 48 * 15),
            new Disc(field_side / 48 * 33, field_side / 48 * 17),
            new Disc(field_side / 48 * 36, field_side / 48 * 17),
            new Disc(field_side / 48 * 39, field_side / 48 * 17),
    
            new Disc(field_side / 48 * 9, field_side / 48 * 31),
            new Disc(field_side / 48 * 12, field_side / 48 * 31),
            new Disc(field_side / 48 * 15, field_side / 48 * 31),
            new Disc(field_side / 48 * 17, field_side / 48 * 33),
            new Disc(field_side / 48 * 17, field_side / 48 * 36),
            new Disc(field_side / 48 * 17, field_side / 48 * 39),
    
            // Preloads and Match Loads
            new Disc(-field_side / 12, field_side / 20 * 7),
            new Disc(-field_side / 12, field_side / 20 * 8),
            new Disc(-field_side / 12, field_side / 20 * 13),
            new Disc(-field_side / 12, field_side / 20 * 12),
    
            new Disc(field_side + field_side / 12, field_side / 20 * 7),
            new Disc(field_side + field_side / 12, field_side / 20 * 8),
            new Disc(field_side + field_side / 12, field_side / 20 * 13),
            new Disc(field_side + field_side / 12, field_side / 20 * 12),
    
            new Disc(-field_side / 12 * 2, field_side / 20 * 7),
            new Disc(-field_side / 12 * 2, field_side / 20 * 8),
            new Disc(-field_side / 12 * 2, field_side / 20 * 9),
            new Disc(-field_side / 12 * 2, field_side / 20 * 10),
            new Disc(-field_side / 12 * 2, field_side / 20 * 11),
            new Disc(-field_side / 12 * 2, field_side / 20 * 12),
            new Disc(-field_side / 12 * 2, field_side / 20 * 13),
    
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 7),
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 8),
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 9),
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 10),
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 11),
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 12),
            new Disc(field_side + field_side / 12 * 2, field_side / 20 * 13),
        ];

        if (is_skills) {
            for (let i = 0; i < 4; i++) {
                const object = this.objects[i];

                if ("state" in object) {
                    object.state = RollerState.Blue;
                }
            }
        }
    }

    save() {
        function round(value: number) {
            return Math.round(value * 100) / 100;
        }

        let data = "";

        for (const object of this.objects) {
            if ("state" in object) {
                switch (object.state) {
                    case RollerState.Blue: {
                        data += "BB";
                    } break;
                    case RollerState.Red: {
                        data += "RR";
                    } break;
                    case RollerState.BlueRed: {
                        data += "BR";
                    } break;
                    case RollerState.RedBlue: {
                        data += "RB";
                    } break;
                }
            } else {
                data += `${round(object.x / inch_pixel_ratio)},${round(object.y / inch_pixel_ratio)};`;
            }
        }

        return data.slice(0, -1);
    }

    load(raw_data: string) {
        const roller_data: [number, number, boolean][] = [
            [this.objects[0].x / inch_pixel_ratio, this.objects[0].y / inch_pixel_ratio, (this.objects[0] as Roller).rotated],
            [this.objects[1].x / inch_pixel_ratio, this.objects[1].y / inch_pixel_ratio, (this.objects[1] as Roller).rotated],
            [this.objects[2].x / inch_pixel_ratio, this.objects[2].y / inch_pixel_ratio, (this.objects[2] as Roller).rotated],
            [this.objects[3].x / inch_pixel_ratio, this.objects[3].y / inch_pixel_ratio, (this.objects[3] as Roller).rotated]
        ];

        for (const object of this.objects) {
            remove_callbacks(object);
        }
        this.objects.length = 0;

        if (!raw_data) return;

        const raw_rollers = [
            raw_data.slice(0, 2),
            raw_data.slice(2, 4),
            raw_data.slice(4, 6),
            raw_data.slice(6, 8)
        ];

        for (let i = 0; i < raw_rollers.length; i++) {
            switch (raw_rollers[i]) {
                case "BB": {
                    this.objects.push(new Roller(roller_data[i][0], roller_data[i][1], roller_data[i][2], RollerState.Blue));
                } break;
                case "RR": {
                    this.objects.push(new Roller(roller_data[i][0], roller_data[i][1], roller_data[i][2], RollerState.Red));
                } break;
                case "BR": {
                    this.objects.push(new Roller(roller_data[i][0], roller_data[i][1], roller_data[i][2], RollerState.BlueRed));
                } break;
                case "RB": {
                    this.objects.push(new Roller(roller_data[i][0], roller_data[i][1], roller_data[i][2], RollerState.RedBlue));
                } break;
            }
        }

        const data = raw_data.slice(8, raw_data.length).split(";");

        for (const encoded_segment of data) {
            const point = encoded_segment.split(",");

            this.objects.push(new Disc(+point[0], +point[1]));
        }
    }

    draw_static(ctx: CanvasRenderingContext2D): void {
        ////// Tape //////
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = .5 * inch_pixel_ratio;
        ctx.lineCap = "square";
        ctx.beginPath();

        // Diagonal Lines

        const line_seperation = Math.SQRT2 + Math.sqrt((.5 / 2) ^ 2 + (.5 / 2) ^ 2);

        ctx.moveTo(line_seperation * inch_pixel_ratio, 0);
        ctx.lineTo((field_side * inch_pixel_ratio), (field_side * inch_pixel_ratio) - line_seperation * inch_pixel_ratio);

        ctx.moveTo(0, line_seperation * inch_pixel_ratio);
        ctx.lineTo((field_side * inch_pixel_ratio) - line_seperation * inch_pixel_ratio, (field_side * inch_pixel_ratio));

        // Starting lines

        ctx.moveTo(0, (field_side * inch_pixel_ratio) / 6);
        ctx.lineTo((field_side * inch_pixel_ratio) / 12, (field_side * inch_pixel_ratio) / 6);

        ctx.moveTo((field_side * inch_pixel_ratio) / 3, 0);
        ctx.lineTo((field_side * inch_pixel_ratio) / 3, (field_side * inch_pixel_ratio) / 12);

        ctx.moveTo((field_side * inch_pixel_ratio), (field_side * inch_pixel_ratio) / 6 * 5);
        ctx.lineTo((field_side * inch_pixel_ratio) / 12 * 11, (field_side * inch_pixel_ratio) / 6 * 5);

        ctx.moveTo((field_side * inch_pixel_ratio) / 3 * 2, (field_side * inch_pixel_ratio));
        ctx.lineTo((field_side * inch_pixel_ratio) / 3 * 2, (field_side * inch_pixel_ratio) / 12 * 11);

        // Low Goal Lines

        ctx.moveTo((field_side * inch_pixel_ratio) / 3 * 2, 0);
        ctx.lineTo((field_side * inch_pixel_ratio) / 3 * 2, (field_side * inch_pixel_ratio) / 6);

        ctx.moveTo((field_side * inch_pixel_ratio), (field_side * inch_pixel_ratio) / 3);
        ctx.lineTo((field_side * inch_pixel_ratio) / 6 * 5, (field_side * inch_pixel_ratio) / 3);

        ctx.moveTo(0, (field_side * inch_pixel_ratio) / 3 * 2);
        ctx.lineTo((field_side * inch_pixel_ratio) / 6, (field_side * inch_pixel_ratio) / 3 * 2);

        ctx.moveTo((field_side * inch_pixel_ratio) / 3, (field_side * inch_pixel_ratio));
        ctx.lineTo((field_side * inch_pixel_ratio) / 3, (field_side * inch_pixel_ratio) / 6 * 5);

        ctx.stroke();

        ////// Bumpers //////

        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 2 / 2 * inch_pixel_ratio;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo((field_side * inch_pixel_ratio) / 6, (field_side * inch_pixel_ratio) / 3 * 2);
        ctx.lineTo((field_side * inch_pixel_ratio) / 3, (field_side * inch_pixel_ratio) / 3 * 2);
        ctx.lineTo((field_side * inch_pixel_ratio) / 3, (field_side * inch_pixel_ratio) / 6 * 5);
        ctx.stroke();

        ctx.strokeStyle = "#0000FF";

        ctx.beginPath();
        ctx.moveTo((field_side * inch_pixel_ratio) / 3 * 2, (field_side * inch_pixel_ratio) / 6);
        ctx.lineTo((field_side * inch_pixel_ratio) / 3 * 2, (field_side * inch_pixel_ratio) / 3);
        ctx.lineTo((field_side * inch_pixel_ratio) / 6 * 5, (field_side * inch_pixel_ratio) / 3);
        ctx.stroke();

        ////// High Goals //////

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2 * inch_pixel_ratio;
        ctx.lineCap = "square";

        ctx.beginPath();
        ctx.moveTo((field_side * inch_pixel_ratio) / 12 * 9, 0);
        ctx.lineTo((field_side * inch_pixel_ratio), (field_side * inch_pixel_ratio) / 12 * 3);

        ctx.moveTo(0, (field_side * inch_pixel_ratio) / 12 * 9);
        ctx.lineTo((field_side * inch_pixel_ratio) / 12 * 3, (field_side * inch_pixel_ratio));
        ctx.stroke();


        const high_goal_diameter = 15.75;
        ctx.fillStyle = "#FF0000";

        ctx.beginPath();
        ctx.arc((field_side * inch_pixel_ratio) / 24 * 21, (field_side * inch_pixel_ratio) / 24 * 3, high_goal_diameter / 2 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#0000FF";

        ctx.beginPath();
        ctx.arc((field_side * inch_pixel_ratio) / 24 * 3, (field_side * inch_pixel_ratio) / 24 * 21, high_goal_diameter / 2 * inch_pixel_ratio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    delete() {
        for (const object of this.objects) {
            remove_callbacks(object);
        }
        this.objects.length = 0;

        saveable_off(this);
    }
}