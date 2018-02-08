import React from "react";

const _model = Symbol('model'), isProxy = Symbol('isProxy');

function generateHandler(cb) {
	return {
		set: (target, prop, value) => {
			let val = target[prop];
			if (val !== value) {
				target[prop] = ProxyFactory(value, cb);
				return (cb && cb()) || true;
			}
			return true;
		}
	};
}

function isBuiltInType(object) {
	return object instanceof Date || object instanceof File
		|| object instanceof Set || object instanceof WeakSet
		|| object instanceof Map || object instanceof WeakMap
		|| object instanceof ArrayBuffer || object instanceof DataView;
}

function ProxyFactory(object, cb = null) {
	if (isBuiltInType(object) || object[isProxy])
		return object;
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

function autobind(context) {
	Object.keys(context)
		.forEach(key => {
			let obj = context[key];
			if (typeof obj === 'function')
				context[key] = obj.bind(context);
		});
}

export function extractOriginal(model) {
	if (isBuiltInType(model)) return model;
	if (typeof model === 'object') {
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
		this.setState = this.setState.bind(this);
		this.onModelUpdate = this.onModelUpdate.bind(this);
		this.getModel = this.getModel.bind(this);
		autobind(this)
	}

	onModelUpdate(model) {
	}

	setState(arg, cb){
		if (cb) return super.setState(arg, cb);
		return new Promise(resolve => super.setState(arg, () => resolve(this.state)));
	}

	set model(model) {
		this.onModelUpdate(extractOriginal(this[_model] = ProxyFactory(model, () =>
			this.setState(prev => Object.assign({}, prev), this.onModelUpdate(extractOriginal(this[_model]))))));
	}

	get model() {
		return this[_model];
	}

	getModel(){
		return extractOriginal(this.model);
	}
}

export default Component;