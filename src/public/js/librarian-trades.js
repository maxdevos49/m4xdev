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
	localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(costs)));
}

function main() {
	const costs = loadCosts();

	for (const row of qsa("tr[data-enchantment]")) {
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

		const greenEnd = Math.round(
			((21 - minCost) / (maxCost - minCost)) * 100,
		);
		const yellowEnd = Math.round(
			((24 - minCost) / (maxCost - minCost)) * 100,
		);

		row.style.setProperty("--green-end", `${greenEnd}%`);
		row.style.setProperty("--yellow-end", `${yellowEnd}%`);

		costInput.addEventListener("input", () => {
			const value = costInput.value;
			const cost = Number(value);

			if (value === "" || Number.isNaN(cost)) {
				costs.delete(key);

				row.style.setProperty("--cost-pct", `50000%`);
				curedCell.innerText = "-";
			} else {
				costs.set(key, cost);

				const curedCost = Math.max(cost - CURE_DISCOUNT, 1);
				const percent = Math.round(
					((cost - minCost) / (maxCost - minCost)) * 100,
				);

				row.style.setProperty("--cost-pct", `${percent}%`);
				curedCell.innerText = curedCost.toString();
			}

			saveCosts(costs);
		});

		const existingCost = costs.get(key);
		if (existingCost !== undefined) {
			costInput.value = existingCost.toString();
			costInput.dispatchEvent(new Event("input"));
		}
	}
}

main();
