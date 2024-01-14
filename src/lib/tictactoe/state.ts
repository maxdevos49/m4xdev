import { writable } from 'svelte/store';

const BOARD_MASK = 0b100000000;
const EMPTY_BOARD = 0b000000000;

function createBoard() {
	const { subscribe, set, update } = writable<number>(EMPTY_BOARD);

	return {
		subscribe,
		mark: (x: number, y: number) => update((board) => board | (BOARD_MASK >>> (x + 3 * y))),
		reset: () => set(EMPTY_BOARD)
	};
}

const player = writable<'x' | 'o'>('x');
const xBoard = createBoard();
const oBoard = createBoard();

export { BOARD_MASK, EMPTY_BOARD, player, xBoard, oBoard };
