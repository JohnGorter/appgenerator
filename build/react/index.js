

// [[global]] 
 
    let datasource1 = new class {
    #listeners
    #value;
    constructor(initialvalue){  
        this.#listeners = []
        this.#value = initialvalue;
    }

    setValue(v){ this.#value = v; this.notifyListeners(); }
    getValue() { return this.#value }
    
    addListener(l){
        this.#listeners.push(l)
    }
    notifyListeners(){
        console.log("number of listeners:", this.#listeners.length)
        this.#listeners.forEach(l => {
            console.log("l", l); 
            l(this.#value);
        })
    }
}(1);
    
    let datasource3 = new class {
    #listeners
    #value;
    constructor(initialvalue){  
        this.#listeners = []
        this.#value = initialvalue;
    }

    setValue(v){ this.#value = v; this.notifyListeners(); }
    getValue() { return this.#value }
    
    addListener(l){
        this.#listeners.push(l)
    }
    notifyListeners(){
        console.log("number of listeners:", this.#listeners.length)
        this.#listeners.forEach(l => {
            console.log("l", l); 
            l(this.#value);
        })
    }
}(1);
     
 let MYButton = ({click, children}) => <button onClick={click}>{children}</button>
let MyLabel = ({text, click}) => <div onClick={click}>value: {text}</div>


class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        { /* [[setup]] */ } 
 
        datasource1.addListener(() => this.setState({}))
        
        datasource3.addListener(() => this.setState({}))
          
    }

    render() {
        return (
              <div>
              <h1>hello world</h1>
              <h2>from react</h2>
                { /* [[local]] */ } 
 <div>Button <MYButton click={() => {datasource1.setValue(datasource1.getValue() + 1)
datasource3.setValue(datasource3.getValue() + 1)
}}>Increment</MYButton></div><div>Button <MYButton click={() => {}}>Increment</MYButton></div><div><MyLabel text={datasource3.getValue()
} click={() => {datasource3.setValue(datasource3.getValue() + 1)
}}> </MyLabel></div><div><MyLabel text={datasource3.getValue()
} click={() => {}}> </MyLabel></div> 
             </div>
          )
        }
}

let root = window.ReactDOM.createRoot(document.querySelector("#main"))
root.render(<App />);
    