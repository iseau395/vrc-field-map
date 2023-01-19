import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from "vitest";
import Button from '../../src/lib/navbar/Button.svelte';

describe('Button.svelte', () => {
    // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
    afterEach(() => cleanup());

    it('mounts', () => {
        const { container } = render(Button, { text: "TestingTesting123" });
        expect(container).toBeTruthy();
        expect(container.innerHTML).toContain("TestingTesting123");
        expect(container.innerHTML).toMatchSnapshot();
    });

    it('registers click', async () => {
        const { component } = render(Button, { text: "TestingTesting123" });

        const fn = vi.fn();
        component.$on("click", fn);

        await fireEvent.click(screen.getByText("TestingTesting123" ));
        expect(fn.mock.calls.length).toEqual(1);
    });
});