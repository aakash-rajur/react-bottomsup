import React from 'react';
import {Button, Table} from "reactstrap";
import './Invoice.css';

function RenderItem({index, row, model}) {
	return (
		<tr>
			<th scope="row" className="align-middle">{`#${index + 1}`}</th>
			<td className="align-middle">{row.item}</td>
			<td className="align-middle">
				<input type="number" className="qty" value={row.qty}
				       onChange={e => {
					       let {value} = e.target;
					       if (value < 0) return;
					       row.qty = value;
				       }}/>
			</td>
			<td className="align-middle">{`$${row.rate}`}</td>
			<td className="price align-middle">{`$${row.rate * row.qty}`}</td>
			<td className="delete">
				<Button className="material-icons icons" size="sm"
				        onClick={() => model.items.splice(index, 1)}>delete</Button></td>
		</tr>
	);
}

export default function ({parent: {model, state, setState}}) {
	return (
		<React.Fragment>
			<div className="header-section">
				<span className="invoice-no">{`#${model.invoiceID}`}</span>
				<span className="date">{`Dated: ${model.date.toLocaleDateString()}`}</span>
			</div>
			<div className="name-section">
				{!state.editName ? <div className="name">{model.name}</div> :
					<input type="text" value={model.name} className="name"
					       onBlur={() => setState({editName: false})}
					       onChange={e => model.name = e.target.value}/>}
				<Button className="material-icons icons" size="sm"
				        color={state.editName ? 'secondary' : 'primary'}
				        onClick={() => setState({editName: !state.editName})}>
					edit
				</Button>
			</div>
			<Table hover className="item-container">
				<thead>
				<tr>
					<th>#</th>
					<th>Item</th>
					<th>QTY</th>
					<th>Rate</th>
					<th className="price">Price</th>
					<th>&nbsp;</th>
				</tr>
				</thead>
				<tbody>
				{model.items.map((item, index) =>
					<RenderItem index={index} row={item} model={model} key={index}/>)}
				{model.items.length < 5 &&
				<tr>
					<th>&nbsp;</th>
					<th>
						<input type="text" value={(model.newItem && model.newItem.item) || ''}
						       onChange={({target: {value}}) => model.newItem = Object.assign(model.newItem || {}, {item: value})}/>
					</th>
					<th>
						<input type="number" className="qty"
						       value={(model.newItem && model.newItem.qty) || 0}
						       onChange={({target: {value}}) => {
							       if (value < 0) return;
							       model.newItem = Object.assign(model.newItem || {}, {qty: parseFloat(value) || 0});
						       }}/></th>
					<th>
						<input type="number" className="qty"
						       value={(model.newItem && model.newItem.rate) || 0}
						       onChange={({target: {value}}) => {
							       if (value < 0) return;
							       model.newItem = Object.assign(model.newItem || {}, {rate: parseFloat(value) || 0});
						       }}/></th>
					<th>{model.newItem ? (({qty, rate}) => (qty || 0) * (rate || 0))(model.newItem) : 0}</th>
					<th>
						<Button color="primary" size="sm" className="material-icons icons"
						        onClick={() => {
							        let {newItem, items} = model;
							        if (newItem && newItem.item && newItem.qty && newItem.rate && items.push(newItem))
								        delete model.newItem;
						        }}>add</Button>
					</th>
				</tr>}
				</tbody>
			</Table>
			{(() => {
				let subtotal = model.items.reduce((acc, item) => acc += item.qty * item.rate, 0),
					taxAmt = Math.floor(model.tax * subtotal * 100) / 100;
				return (
					<React.Fragment>
						<h4 className="subtotal-section">
							<span>Subtotal:</span>
							<span>{`$${subtotal}`}</span>
						</h4>
						<h5 className="subtotal-section">
							<span>{`Tax(${model.tax * 100}%):`}</span>
							<span>{`$${taxAmt}`}</span>
						</h5>
						<h2 className="subtotal-section">
							<span>Total</span>
							<span>{`$${model.total}`}</span>
						</h2>
					</React.Fragment>
				);
			})()}
		</React.Fragment>
	)
}