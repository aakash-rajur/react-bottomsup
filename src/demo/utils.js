export function fetchInvoice(invoiceID) {
	return new Promise(resolve => {
		setTimeout(resolve, 1000,{
			invoiceID,
			name: 'John Doe',
			date: new Date(),
			items: [
				{item:'Milk', qty: 2, rate: 2},
				{item:'Bread', qty: 1, rate: 1},
				{item:'Chicken', qty: 0.5, rate: 5}
			],
			tax: 0.1,
			total: 8.25
		});
	})
}