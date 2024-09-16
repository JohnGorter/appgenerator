

 
 





 
 


            let datasource1 = new class {
            #listeners
            #value;
            #filtered;
            constructor(initialvalue){  
                this.#listeners = []
                this.#value = initialvalue;
                this.#filtered = initialvalue;
            }
        
            add(v){ this.#value.push(v);this.notifyListeners();}
            refresh(v){ this.#value.push(v);this.notifyListeners();}
            setValue(v){ this.#value = v; this.notifyListeners(); }
            getValue() { return this.#filtered }
            filter(f) { if (!f) this.#filtered = this.#value; else this.#filtered = this.#value.filter(e => e == f); this.notifyListeners()}
            
            addListener(l){
                this.#listeners.push(l)
            }
            notifyListeners(){
                console.log("number of listeners:", this.#listeners.length)
                this.#listeners.forEach(l => {
                    l(this.#value);
                })
            }
        }(['a','b','c','d']);

    

                    let datasource2 = new class {
                    #listeners
                    #value;
                    constructor(initialvalue){  
                        this.#listeners = []
                        this.#value = initialvalue;
                    }
                
                    refresh(v){ this.#value = v;this.notifyListeners();}
                    setValue(v){ this.#value = v; this.notifyListeners(); }
                    getValue() { return this.#value }
                    
                    addListener(l){
                        this.#listeners.push(l)
                    }
                    notifyListeners(){
                        this.#listeners.forEach(l => {
                            l(this.#value);
                        })
                    }
                }('');
    




class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        
    this.handleChange15 = function(e) {  window.statemanagement.setState(15, e.target.value); this.setState({});};

                datasource1.addListener(() => this.setState({}))
    

                        datasource2.addListener(() => this.setState({}))
    

    this.handleChange5 = function(e) {  window.statemanagement.setState(5, e.target.value); this.setState({});};
  
    }

    render() {
        return (
              <div>
             <h4>red </h4>
              <h1>Jeroen</h1>
              <h2>[[siebe]]</h2>
                <input type="text" placeholder={String('undefined')} value={window.statemanagement.getState(15) || ''} onChange={(e) => this.handleChange15(e)}></input><input type="submit" value="search" onClick={(e) => {let event = window.statemanagement.getState(15);datasource1.filter(event);
}}></input>


        <div>{datasource1.getValue().map(element => <div onClick={() => {let event = element;  datasource2.refresh(event);
}} key={JSON.stringify(element)}> { JSON.stringify(element) } </div>)}</div>
    
<div>SELECTED ITEM: {datasource2.getValue()
}</div>

<input type="text" placeholder={String(datasource2.getValue()
)} value={window.statemanagement.getState(5) || ''} onChange={(e) => this.handleChange5(e)}></input><input type="submit" onClick={(e) => {let event = window.statemanagement.getState(5);datasource1.add(event);
}}></input>

 
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
    