import { inch_pixel_ratio } from "../../field";
import { collisionbox, in_collision, object, on, selection } from "../../objects/object";
import type { Input } from "../../types";

export enum RollerState {
    Blue,
    BlueRed,
    Red,
    RedBlue
}

@object
@collisionbox(0, 0, 9.8 * inch_pixel_ratio, 2.4 * inch_pixel_ratio)
export class HorizontalRoller {
    public x: number;
    public y: number;

    public state: RollerState;

    constructor(x: number, y: number, rotated: boolean, state: RollerState) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;

        this.state = state;
    }

    private was_clicked = false;
    @on("update")
    public update(input: Input) {
        if (input.mouse_button == 0 && in_collision(this, input.mouse_x, input.mouse_y) && !this.was_clicked && selection == -1) {
            this.state++;
            this.state %= 4;

            this.was_clicked = true;
        } else if (input.mouse_button != 0) {
            this.was_clicked = false;
        }
    }

    @on("render")
    public render(ctx: CanvasRenderingContext2D) {
        let w = 9.8;
        let h = 2.4/2;

        ctx.fillStyle = this.state == RollerState.Blue || this.state == RollerState.BlueRed ? "#0000FF" : "#FF0000";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillRect(this.x, this.y, w*inch_pixel_ratio, h*inch_pixel_ratio);
        ctx.fillStyle = this.state == RollerState.Blue || this.state == RollerState.RedBlue ? "#0000FF" : "#FF0000";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillRect(this.x, this.y + h*inch_pixel_ratio - 1, w*inch_pixel_ratio, h*inch_pixel_ratio);
    }
}


@object
@collisionbox(0, 0, 2.4 * inch_pixel_ratio, 9.8 * inch_pixel_ratio)
export class VerticalRoller {
    public x: number;
    public y: number;
    public state: RollerState;

    constructor(x: number, y: number, rotated: boolean, state: RollerState) {
        this.x = x * inch_pixel_ratio;
        this.y = y * inch_pixel_ratio;

        this.state = state;
    }

    private was_clicked = false;
    @on("update")
    public update(input: Input) {
        if (input.mouse_button == 0 && in_collision(this, input.mouse_x, input.mouse_y) && !this.was_clicked && selection == -1) {
            this.state++;
            this.state %= 4;

            this.was_clicked = true;
        } else if (input.mouse_button != 0) {
            this.was_clicked = false;
        }
    }

    @on("render")
    public render(ctx: CanvasRenderingContext2D) {
        let w = 2.4/2;
        let h = 9.8;

        ctx.fillStyle = this.state == RollerState.Blue || this.state == RollerState.BlueRed ? "#0000FF" : "#FF0000";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillRect(this.x, this.y, w*inch_pixel_ratio, h*inch_pixel_ratio);
        ctx.fillStyle = this.state == RollerState.Blue || this.state == RollerState.RedBlue ? "#0000FF" : "#FF0000";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillRect(this.x + w*inch_pixel_ratio - 1, this.y, w*inch_pixel_ratio, h*inch_pixel_ratio);
    }
}