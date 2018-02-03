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


### setState(state[, cb])

a promisified wrapper around react's native setState.  
Will return a promise if you skip the callback parameter


## Demo source
https://github.com/aakashRajur/react-bottomsup/tree/master/src/demo  
made using create-react-app

## [Licence](https://github.com/aakashRajur/react-bottomsup/blob/master/LICENCE)
Feel free to use the source anyhow you want.  


## Got an idea or can you improve it?
hit me up.  
Welcome to ideas, queries and suggestions