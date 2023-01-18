import { cleanup, render } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import Navbar from "/src/lib/navbar/NavBar.svelte";

describe("Navbar.svelte", () => {
    // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
    afterEach(() => cleanup());

    it("mounts", () => {
        const { container } = render(Navbar);
        expect(container).toBeTruthy();
        expect(container.innerHTML).toMatchSnapshot();
    });
});