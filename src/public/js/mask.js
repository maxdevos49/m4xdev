// Found this after half way through this: http://www.bradgoodman.com/bittool/

function main() {
	/** @type {HTMLButtonElement|null} */
	const toggleAllOnButton = document.querySelector("#mask-toggle-on");
	if (!toggleAllOnButton) {
		throw new Error("toggleAllOnButton element is missing");
	}

	/** @type {HTMLButtonElement|null} */
	const toggleAllOffButton = document.querySelector("#mask-toggle-off");
	if (!toggleAllOffButton) {
		throw new Error("toggleAllOffButton element is missing");
	}

	/** @type {HTMLButtonElement|null} */
	const invertAllButton = document.querySelector("#mask-invert");
	if (!invertAllButton) {
		throw new Error("toggleAllOffButton element is missing");
	}

	/** @type {Array<HTMLInputElement>} */
	const bitToggles = [];
	for (let i = 0; i < 64; i++) {
		/** @type {HTMLInputElement|null} */
		const bitToggle = document.querySelector("#mask-bit-" + i);
		if (!bitToggle) {
			throw new Error("bitToggle element is missing. Id: #mask-bit-" + i);
		}

		bitToggles.push(bitToggle);
	}

	/** @type {HTMLInputElement|null} */
	const hexInput = document.querySelector("#mask-hex");
	if (!hexInput) {
		throw new Error("hexInput element is missing");
	}

	/** @type {HTMLInputElement|null} */
	const binInput = document.querySelector("#mask-bin");
	if (!binInput) {
		throw new Error("binInput element is missing");
	}
	toggleAllOnButton.addEventListener("click", (e) => {
		bitToggles.forEach(b => b.checked = true);

		updateInputs();
	})

	toggleAllOffButton.addEventListener("click", (e) => {
		bitToggles.forEach(b => b.checked = false);

		updateInputs();
	})

	invertAllButton.addEventListener("click", (e) => {
		bitToggles.forEach(b => {
			b.checked = !b.checked;
		});

		updateInputs();
	})

	for (const bit of bitToggles) {
		bit.addEventListener("change", () => {
			console.log("change")
			updateInputs();
		})
	}

	const calculateHex = () => {
		let str1 = "";

		// MSB bin
		for (let i = 63; i >= 32; i--) {
			if (bitToggles[i].checked) {
				str1 += "1";
			} else {
				str1 += "0";
			}
		}

		str1 = parseInt(str1, 2).toString(16).padStart(8, "0")

		let str2 = "";

		// LSB bin
		for (let i = 31; i >= 0; i--) {
			if (bitToggles[i].checked) {
				str2 += "1";
			} else {
				str2 += "0";
			}
		}

		str2 = parseInt(str2, 2).toString(16).padStart(8, "0")


		hexInput.value = "0x" + str1 + str2;
	}

	const calculateBin = () => {
		let str = "";

		for (const bit of bitToggles) {
			if (bit.checked) {
				str += "1";
			} else {
				str += "0";
			}
		}

		str = str.split("").reverse().join("")

		binInput.value = "0b" + str;
	}

	const updateInputs = () => {
		calculateHex();
		calculateBin();
	};
}


main();
