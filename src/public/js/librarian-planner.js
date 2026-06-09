import { qsa, qsOrThrow } from "./utilities.js";

const STORAGE_KEY = "librarian_trades";
const CURE_DISCOUNT = 20;

/**
 * @returns {Map<string, number>}
 */
function loadCosts() {
	const data = localStorage.getItem(STORAGE_KEY);
	if (data === null) return new Map();
	return new Map(JSON.parse(data));
}

/**
 * @param {Map<string, number>} costs
 * @returns {void}
 */
function saveCosts(costs) {
	const json = JSON.stringify(Array.from(costs));
	localStorage.setItem(STORAGE_KEY, json);
}

/**
 * @param {HTMLTextAreaElement} textarea
 * @param {Map<string, number>} costs
 * @returns {void}
 */
function renderTextarea(textarea, costs) {
	const json = JSON.stringify(Array.from(costs));
	textarea.value = json;
}

/**
 * @param {HTMLTableRowElement} row
 * @param {(key: string, cost: number | undefined) =>void} onCostChange
 * @returns {{key: string, render: (cost: number|undefined) => void}}
 */
function setupRow(row, onCostChange) {
	const key = row.dataset.enchantment;
	if (key === undefined) {
		throw new Error("Enchantment row key is missing.", {
			cause: row,
		});
	}

	const costInput = qsOrThrow(row, "input");
	const curedCell = qsOrThrow(row, "[data-current-cured-cost]");

	const minCost = Number(costInput.min);
	const maxCost = Number(costInput.max);

	const greenEnd = Math.round(((21 - minCost) / (maxCost - minCost)) * 100);
	const yellowEnd = Math.round(((24 - minCost) / (maxCost - minCost)) * 100);

	row.style.setProperty("--green-end", `${greenEnd}%`);
	row.style.setProperty("--yellow-end", `${yellowEnd}%`);

	/**
	 * Row render function.
	 *
	 * @param {number|undefined} cost
	 * @returns {void}
	 */
	function render(cost) {
		if (cost === undefined) {
			costInput.value = "";
			row.style.setProperty("--cost-pct", "50000%");
			curedCell.innerText = "-";
		} else {
			costInput.value = cost.toString();

			const curedCost = Math.max(cost - CURE_DISCOUNT, 1);
			const percent = Math.round(
				((cost - minCost) / (maxCost - minCost)) * 100,
			);

			row.style.setProperty("--cost-pct", `${percent}%`);
			curedCell.innerText = curedCost.toString();
		}
	}

	costInput.addEventListener("input", () => {
		const value = costInput.value;
		const cost = Number(value);

		if (value === "" || Number.isNaN(cost)) {
			render(undefined);
			onCostChange(key, undefined);
		} else {
			render(cost);
			onCostChange(key, cost);
		}
	});

	return { key, render };
}

function main() {
	let costs = loadCosts();
	/** @type {Map<string, (cost: number|undefined) => void>} */
	const renderers = new Map();

	const textarea = qsOrThrow("textarea");
	const rows = qsa("tr").filter((row) => row.dataset.enchantment);

	/**
	 * @param {string} key
	 * @param {number|undefined} cost
	 * @returns {void}
	 */
	function handleInputChange(key, cost) {
		if (cost === undefined) {
			costs.delete(key);
		} else {
			costs.set(key, cost);
		}

		renderTextarea(textarea, costs);
		saveCosts(costs);
	}

	for (const row of rows) {
		const { key, render } = setupRow(row, handleInputChange);
		renderers.set(key, render);
	}

	function handleTextAreaChange() {
		try {
			const data = JSON.parse(textarea.value);
			costs = new Map(data);
		} catch (error) {
			alert(
				"Invalid JSON or JSON format. Did you copy and paste the right thing?",
			);
			console.error(error);
			return;
		}

		for (const [key, render] of renderers) {
			render(costs.get(key));
		}

		saveCosts(costs);
	}

	textarea.addEventListener("input", handleTextAreaChange);

	// Initial render.
	for (const [key, render] of renderers) {
		render(costs.get(key));
	}
	renderTextarea(textarea, costs);
}

main();
