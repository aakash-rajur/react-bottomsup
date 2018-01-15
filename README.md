# react-bottomsup

>Two-way binding for react apps  
Uses proxy to intercept changes

## Demo

https://aakashrajur.github.io/react-bottomsup/

## Getting Started
```
npm install react-bottomsup
```

## Usage
```js
//mutate the model object as much as you want,
//supports deep objects within the model object as well
import React from 'react';
import Component from 'react-bottomsup';


/**
* extend the Component class provided by this module instead of React's own
* Component class.
* Since the provided component class extends React's Component class
* no native functionality or featue provided by it is lost.
* package provided class updates using React Component's setState
*/
class App extends Component {
    constructor(props){
        super(props);
        this.model = {
            text: ''
        };
    }

    //provides the updated model object
    //this.model is a proxy while provided argument is a normal js object
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

Note: Built-in objects like ```Date```, ```File```, ```Set```, ```WeakSet```, ```Map```, ```WeakMap``` can't be further deep proxified and returned as it is. An object containing them can still be proxified
## API

### onModelUpdate(model)

called after every mutation of the model.   
Note: do not stringify ```this.model``` as your app might crash, use the model object provided in the callback instead
