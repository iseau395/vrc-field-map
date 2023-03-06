import { set_cursor } from "../../field";
import { inch_pixel_ratio } from "../../constants";
import { add_box_collision, in_collision, object, on, selection } from "../../objects/object";
import type { Input } from "../../types";

export enum RollerState {
    Blue,
    BlueRed,
    Red,
    RedBlue
}

@object
export class Roller {
    public x: number;
    public y: number;

    public state: RollerState;
    public rotated: boolean;

    constructor(x: number, y: number, rotated: boolean, state: RollerState) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;

        this.rotated = rotated;

        if (!this.rotated)
            add_box_collision(this, 0, 0, 9.8 * inch_pixel_ratio, 2.4 * inch_pixel_ratio);
        else 
            add_box_collision(this, 0, 0, 2.4 * inch_pixel_ratio, 9.8 * inch_pixel_ratio);

        this.state = state;
    }

    @on("update")
    public update(input: Input) {
        const mouse_over = in_collision(this, input.gridless_mouse_x, input.gridless_mouse_y);

        if (input.mouse_button == 0 && mouse_over && input.mouse_button_changed && selection == -1) {
            this.state++;
            this.state %= 4;
        }

        if (mouse_over && selection == -1)
            set_cursor("pointer");
    }

    @on("render")
    public render(ctx: CanvasRenderingContext2D) {
        let w: number;
        let h: number;
        if (!this.rotated) {
            w = 9.8;
            h = 2.4/2;
        } else {
            w = 2.4/2;
            h = 9.8;
        }

        ctx.fillStyle = this.state == RollerState.Blue || this.state == RollerState.BlueRed ? "#0000FF" : "#FF0000";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillRect(this.x, this.y, w*inch_pixel_ratio, h*inch_pixel_ratio);
        ctx.fillStyle = this.state == RollerState.Blue || this.state == RollerState.RedBlue ? "#0000FF" : "#FF0000";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillRect(this.x + (this.rotated ? w*inch_pixel_ratio - 1 : 0), this.y + (!this.rotated ? h*inch_pixel_ratio - 1 : 0), w*inch_pixel_ratio, h*inch_pixel_ratio);
    }
}