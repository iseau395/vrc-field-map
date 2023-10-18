export enum GameType {
    SpinUp,
    OverUnder
}

export interface Game {
    draw_static(ctx: CanvasRenderingContext2D): void;

    delete(): void;
}