import React from "react";

const _model = Symbol('model'), isProxy = Symbol('isProxy');

function generateHandler(cb) {
	return {
		set: (target, prop, value) => {
			let val = target[prop];
			if (val !== value) {
				target[prop] = ProxyFactory(value, cb);
				cb && cb()
			}
			return true;
		}
	};
}

function ProxyFactory(object, cb = null) {
	if (object instanceof Date || object[isProxy]) return object;
	if (typeof object === 'object') {
		if (Array.isArray(object))
			return new Proxy(object.map(item => ProxyFactory(item, cb)), generateHandler(cb));
		object[isProxy] = true;
		let keys = Object.keys(object);
		keys.forEach(key => object[key] = ProxyFactory(object[key], cb));
		return new Proxy(object, generateHandler(cb));
	}
	return object;
}

export function extractOriginal(model) {
	if (typeof model === 'object'){
		if (Array.isArray(model))
			return model.map(item => extractOriginal(item));
		let clone = {}, keys = Object.keys(model);
		keys.forEach(key => clone[key] = extractOriginal(model[key]));
		return clone;
	}
	return model;
}

class Component extends React.Component {
	constructor(props) {
		super(props);
		this.onModelUpdate = this.onModelUpdate.bind(this);
	}
	
	onModelUpdate(model) {
	}
	
	set model(model) {
		this[_model] = ProxyFactory(model, () => this.setState({__UPDATE: Date.now()}, this.onModelUpdate(extractOriginal(this[_model]))));
		this.onModelUpdate(extractOriginal(this[_model]));
	}
	
	get model() {
		return this[_model];
	}
}

export default Component;