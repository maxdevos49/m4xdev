type ProductLineItem = {
	id: string;
	name: string;
	currency: string;
	quantity: number;
	amount: number;
	// quantity * amount = total
	total: number;
};

type SummaryLineItem = {
	type: 'subtotal' | 'shipping' | 'tax' | 'fee' | 'discount' | 'total';
	label: string;
	total: number;
	data?: string;
	currency: string;
};

export type { ProductLineItem, SummaryLineItem };
