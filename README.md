# react-bottomsup

>Two-way binding for react apps  
Uses proxy to intercept changes

## Demo

https://aakashrajur.github.io/react-bottomsup/

## Getting Started
```npm
npm install react-bottomsup
```

## Usage
```jsx harmony
//mutate the model object as much as you want,
//supports deep objects within the model object as well
import React from 'react';
import Component from 'react-bottomsup';


/**
* extend the Component class provided by this module instead of React's own
* Component class.
* Since the provided component class extends React's own Component class,
* no native functionality or featue provided by the former is lost.
* class provided by this module updates using React Component's own setState
*/
class App extends Component {
    constructor(props){
        super(props);
        this.model = {
            text: ''
        };
    }

    //provides the updated model object
    //this.model is a proxy while the provided argument is a normal js object
    onModelUpdate(model) {
        console.log(model);
    }

    render(){
        return (
            <div>
                <input type="text" value={this.model.text} onChange={e => this.model.text = e.target.value}/>
                <div>{this.model.text}</div>
            </div>
        );
    }
}
```

Note: Built-in objects like ```Date```, ```File```, ```Set```, ```WeakSet```, ```Map```, ```WeakMap``` can't be further deep proxified and are returned as it is. An object containing them can still be proxified
## API

### onModelUpdate(model)

called after every mutation of the model.   
Note: do not stringify ```this.model``` as your app might crash, use the model object provided in the callback instead


### getModel()

return the plain js version of the model


### setState(state[, cb])

a promisified wrapper around react's native setState.  
Will return a promise if you skip the callback parameter
```textmate
Note: await for setState in scenarios wherein  
a loader is shown on form submit,  
we await for a response and   
then we close a loader.  

setState batches render updates, awaiting for every update    
will destroy the whole purpose or react's optimization.   
**`Use it wisely!`**
```  

### Auto bind

all function defined in the class are auto bound.  
```jsx harmony
/**
* No need to do this any more in your constructor
**/
this.mySuperFunction = this.mySuperFunction.bind(this);
```

## Strategies

### mix as much as you want

```jsx harmony
import ModelComponent from 'react-bottomsup';
import React from 'react';

class ModelView extends ModelComponent {
    constructor(props){
        super(props);
        this.model = {
            someInput: ''
        };
    }
    
    render(){
        return (<input value={this.model.someInput} onChange={e => this.model.someInput = e.target.value}/>);
    }
}

class App extends React.Component {
    render() {
        return (<ModelView/>);    
    }
}
```

### Forms

```jsx harmony
import Component from 'react-bottomsup';
import axios from 'axios';


/**
    for validation, you could declare a span below the input 
    and dynamically set and show the error text within it.
    
    This one is for normalization
*/
const dynamicNormalizer = type => {
	switch (type){
        case 'alpha': return (value, prevValue) => /^$([A-Z]+$)\w+/g.test(value) ? value : prevValue;
		case 'alphanumeric': return (value, prevValue) => /^$([A-Z0-9]+$)\w+/g.test(value) ? value : prevValue;
        case 'numeric': return (value, prevValue) => /^$([0-9]+$)\w+/g.test(value) ? value: prevValue;
        default: return (value) => value;
	}
};

class Form extends Component {
	constructor(props){
		super(props);
		//inspired by redux-form
		this.model = {
			form: {
				inputText: ''
			},
			errors: {
				inputText: null
			}
		};
	}
	
	async onSubmit() {
		let {form} = this.getModel();
		let response = await axios({
		    method: 'POST',
		    url: 'example.com/api',
		    data: form
		});
	}
	
	render(){
		return (
			<form id='form1' onSubmit={this.onSubmit}>
			    <input value={this.model.form.inputText} 
			        onChange={e => {
			        	this.model.form.inputText = dynamicNormalizer('alphanumeric')
                            (e.target.value, this.model.form.inputText);
			        }}/>
			</form>
		);
	}
}
```


### Global State like Redux

The philosophy of single source of truth is really good,  
but to write several helper functions just to mutate some UI  
seems to be too much work. 

We could declare a model in the top most component in the hierarchy(single source of truth?)  
and pass it down to child components. We don't have to dispatch   
billion times just to re-render a component.

## Demo source
https://github.com/aakashRajur/react-bottomsup/tree/master/src/demo  
made using create-react-app

## [Licence (MIT)](https://github.com/aakashRajur/react-bottomsup/blob/master/LICENCE)
Feel free to use the source anyhow you want.  


## Got an idea or can you improve it?
hit me up.  
If you think having this feature in react would be cool,  
we should rather be discussing the ways to implement it.