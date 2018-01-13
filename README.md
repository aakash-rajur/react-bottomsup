# react-bottomsup

>Two-way binding for react apps
Uses proxy to intercept changes

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

class App extends Component {
    constructor(props){
        super(props);
        this.model = {
            text: ''
        };
    }

    //provides the updated model object
    //this.model is a proxy while this argument is a normal js object
    onModelUpdate(model) {
        console.log(model);
    }

    render(){
        return (
            <div>
                <input type="text" inputMode={this.model.text} onChange={e => this.model.text = e.target.value}/>
                <div>{this.model.text}</div>
            </div>
        );
    }
}
```

## API

### onModelUpdate(model)

called after every mutation of the model.
Note: do not stringify this.model as your app might crash, use this object instead