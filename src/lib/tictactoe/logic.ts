import { BOARD_MASK } from './state';

const WIN_HORIZONTAL_1 = 0b111000000;
const WIN_HORIZONTAL_2 = WIN_HORIZONTAL_1 >>> 3;
const WIN_HORIZONTAL_3 = WIN_HORIZONTAL_1 >>> 6;
const WIN_VERTICAL_1 = 0b100100100;
const WIN_VERTICAL_2 = WIN_VERTICAL_1 >>> 1;
const WIN_VERTICAL_3 = WIN_VERTICAL_1 >>> 2;
const WIN_DIAGONAL_1 = 0b100010001;
const WIN_DIAGONAL_2 = 0b001010100;
const SCRATCH = 0b111111111;

function isMarked(x: number, y: number, board: number): boolean {
	return (board & (BOARD_MASK >>> (x + 3 * y))) > 0;
}

function isScratch(xBoard: number, oBoard: number): boolean {
	return (xBoard | oBoard) === SCRATCH && !(isWon(xBoard) || isWon(oBoard));
}

function mask(value: number, mask: number): boolean {
	return (value & mask) === mask;
}

function isWon(board: number): boolean {
	if (mask(board, WIN_HORIZONTAL_1)) {
		return true;
	} else if (mask(board, WIN_HORIZONTAL_2)) {
		return true;
	} else if (mask(board, WIN_HORIZONTAL_3)) {
		return true;
	} else if (mask(board, WIN_VERTICAL_1)) {
		return true;
	} else if (mask(board, WIN_VERTICAL_2)) {
		return true;
	} else if (mask(board, WIN_VERTICAL_3)) {
		return true;
	} else if (mask(board, WIN_DIAGONAL_1)) {
		return true;
	} else if (mask(board, WIN_DIAGONAL_2)) {
		return true;
	}

	return false;
}

export { isMarked, isScratch, isWon, mask, WIN_DIAGONAL_1, WIN_DIAGONAL_2, WIN_HORIZONTAL_1, WIN_HORIZONTAL_2, WIN_HORIZONTAL_3, WIN_VERTICAL_1, WIN_VERTICAL_2, WIN_VERTICAL_3 };
