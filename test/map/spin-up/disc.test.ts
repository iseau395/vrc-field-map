import { describe, test, expect } from "vitest";
import { update_objects } from "src/lib/map/objects/object";
import { Disc } from "src/lib/map/games/spin-up/disc";
import { inch_pixel_ratio } from "src/lib/map/field";

describe("Disc", () => {
    test.each([
        [25, 35],
        [-3, 13],
        [144, 0],
    ])("constructs", (x, y) => {
        const disc = new Disc(x, y);
        expect(disc.x / inch_pixel_ratio).toBe(x);
        expect(disc.y / inch_pixel_ratio).toBe(y);
    });

    test.skip.each([
        [25, 35, 44, 58],
        [-3, 13, 50, -70],
        [144, 0, 0, 144],
    ])("drags", (x1, y1, x2, y2) => {
        const disc = new Disc(x1, y1);

        update_objects({
            mouse_x: 0,
            mouse_y: 0,
            gridless_mouse_x: 0,
            gridless_mouse_y: 0,
            mouse_button: -1,
            mouse_button_changed: false,
            wheel: 1,
            keys: new Map<string, boolean | undefined>(),
        });

        expect(disc.x / inch_pixel_ratio).toBe(x1);
        expect(disc.y / inch_pixel_ratio).toBe(y1);

        update_objects({
            mouse_x: x1,
            mouse_y: y1,
            gridless_mouse_x: x2,
            gridless_mouse_y: y2,
            mouse_button: 0,
            mouse_button_changed: true,
            wheel: 1,
            keys: new Map<string, boolean | undefined>(),
        });

        expect(disc.x / inch_pixel_ratio).toBe(x1);
        expect(disc.y / inch_pixel_ratio).toBe(y1);

        update_objects({
            mouse_x: x2,
            mouse_y: y2,
            gridless_mouse_x: x2,
            gridless_mouse_y: y1,
            mouse_button: 0,
            mouse_button_changed: false,
            wheel: 1,
            keys: new Map<string, boolean | undefined>(),
        });

        expect(disc.x / inch_pixel_ratio).toBe(x2);
        expect(disc.y / inch_pixel_ratio).toBe(y2);
    });
});