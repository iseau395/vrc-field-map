// stolen from the svelte tutorial lol

import type { SvelteComponent } from "svelte";

export function clickOutside(node: HTMLElement | SvelteComponent) {
    const handleClick = (event: MouseEvent) => {
        if (!node.contains(event.target)) {
            node.dispatchEvent(new CustomEvent("outclick"));
        }
    };

    document.addEventListener("click", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}