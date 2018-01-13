import React from 'react';
import Component from "../lib/Component";
import './App.css';
import {Jumbotron} from 'reactstrap';

import {fetchInvoice} from './utils';
import Loading from "./components/Loading";
import Invoice from "./components/Invoice";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: null,
			editName: false
		}
	}
	
	async componentDidMount() {
		this.model = await fetchInvoice(Math.round(Number(Math.random() * 1000)));
	}
	
	onModelUpdate(model) {
		this.setState({model}, () => {
			let subtotal = this.model.items.reduce((acc, item) => acc += item.qty * item.rate, 0),
				taxAmt = Math.floor(this.model.tax * subtotal * 100) / 100, total = taxAmt + subtotal;
			if (this.model.total !== total) this.model.total = total;
		});
	}
	
	render() {
		return (
			<div className="app">
				<Jumbotron fluid className="section invoice">
					{this.model ? <Invoice parent={this}/> : <Loading/>}
				</Jumbotron>
				<Jumbotron fluid className="section model">
					{this.state.model ? <pre>{JSON.stringify(this.state.model, null, '\t')}</pre> : <Loading/>}
				</Jumbotron>
			</div>
		);
	}
}

export default App;