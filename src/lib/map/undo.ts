interface UndoEvent {
    undo: () => void;
    redo: () => void;
}

const undos: UndoEvent[] = [];
const redos: UndoEvent[] = [];

function register_undo(event: UndoEvent) {
    redos.length = 0;

    undos.push(event);
}

function undo() {
    if (undos.length == 0) return;

    const event = undos.pop();

    event.undo();

    redos.push(event);
}

function redo() {
    if (redos.length == 0) return;

    const event = redos.pop();

    event.redo();

    undos.push(event);
}