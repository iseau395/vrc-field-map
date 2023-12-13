export enum GameType {
    SpinUp,
    OverUnder
}

export function game_type_to_string(game_time: GameType): string {
    switch (game_time) {
        case GameType.OverUnder: {
            return "Over Under";
        } break;
        case GameType.SpinUp: {
            return "Spin Up";
        } break;
    }
}

export function string_to_game_type(text: string): GameType | undefined {
    switch (text) {
        case "Over Under": {
            return GameType.OverUnder;
        } break;
        case "Spin Up": {
            return GameType.SpinUp;
        } break;
    }
}

export interface Game {
    draw_static(ctx: CanvasRenderingContext2D): void;

    delete(): void;
}