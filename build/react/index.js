

 
 
    let datasource1 = new class {
    #listeners
    #value;
    constructor(initialvalue){  
        this.#listeners = []
        this.#value = initialvalue;
    }

    refresh(v){ this.#value = this.#value+1; this.notifyListeners(); }
    setValue(v){ this.#value = v; this.notifyListeners(); }
    getValue() { return this.#value }
    
    addListener(l){
        this.#listeners.push(l)
    }
    notifyListeners(){
        this.#listeners.forEach(l => {
            console.log("l", l); 
            l(this.#value);
        })
    }
}(1);
    
    let datasource4 = new class {
    #listeners
    #value;
    constructor(initialvalue){  
        this.#listeners = []
        this.#value = initialvalue;
    }

    refresh(v){ this.#value = this.#value+1; this.notifyListeners(); }
    setValue(v){ this.#value = v; this.notifyListeners(); }
    getValue() { return this.#value }
    
    addListener(l){
        this.#listeners.push(l)
    }
    notifyListeners(){
        this.#listeners.forEach(l => {
            console.log("l", l); 
            l(this.#value);
        })
    }
}(1);
     
 let MyLabel = ({text, click}) => <div onClick={click}>value: {text}</div>
let MYButton = ({click, children}) => <button onClick={click}>{children}</button>


class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
         
 
        datasource1.addListener(() => this.setState({}))
        
        datasource4.addListener(() => this.setState({}))
          
    }

    render() {
        return (
              <div>
             <h4>red </h4>
              <h1>Jeroen</h1>
              <h2>john</h2>
                 
 <div><MyLabel text={datasource4.getValue()
} click={() => {}}> </MyLabel></div><div><MyLabel text={datasource4.getValue()
} click={() => {datasource4.refresh(event);
}}> </MyLabel></div><div><MyLabel text={datasource4.getValue()
} click={() => {}}> </MyLabel></div><div>Button <MYButton click={() => {datasource1.refresh(event);
}}>increment me</MYButton></div><div>Button <MYButton click={() => {datasource4.refresh(event);
}}>increment me not</MYButton></div><marquee>generic placeholder txcxcxzcest</marquee><marquee>generic placeholder uhhohoh</marquee><b>hi i am arjan</b> 
             </div>
          )
        }
}

class StateMnmgt {
  state = []; 
  getState(id) {
    return this.state.find((s) => s.id == id)?.value
  }
  setState(id, value) {
    for (let item of this.state) {
        if (item.id == id) { item.value = value; return; }  
    }
    this.state.push({id, value});
  } 
}
window.statemanagement = new StateMnmgt(); 

let root = window.ReactDOM.createRoot(document.querySelector("#main"))
root.render(<App />);
    