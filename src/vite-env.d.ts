/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
    interface HTMLProps<T> {
        onoutclick: (e: CustomEvent) => void;
    }
}