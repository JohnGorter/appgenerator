

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '[[style]]');
document.head.appendChild(link);

 
 




 
 


            let datasource1 = new class {
            #listeners
            #value;
            #filtered;
            #selected;
            constructor(initialvalue){  
                this.#listeners = []
                this.#value = initialvalue;
                this.#filtered = initialvalue;
                this.#selected = initialvalue[0];
            }
        
            add(v){ this.#value.push({title:v, subtitle:v});this.notifyListeners();}
            refresh(v){ this.#value.push(v);this.notifyListeners();}
            setValue(v){ this.#value = v; this.notifyListeners(); }
            getValue() { return this.#selected }
            getList() { return this.#filtered }
            select(f) { this.#selected = f;  this.notifyListeners()}
            search(f) { if (!f) this.#filtered = this.#value; else this.#filtered = this.#value.filter(e => e.title.indexOf(f)  > -1); this.notifyListeners()}
            
            addListener(l){
                this.#listeners.push(l)
            }
            notifyListeners(){
                // console.log("number of listeners:", this.#listeners.length)
                this.#listeners.forEach(l => {
                    l(this.#value);
                })
            }
        }([
            {title:"john1", subtitle:"gorter"},
            {title:"john2", subtitle:"gorter"},
            {title:"john3", subtitle:"gorter"},
            {title:"john4", subtitle:"gorter"},
            {title:"john5", subtitle:"gorter"},
            {title:"john6", subtitle:"gorter"},
            {title:"john7", subtitle:"gorter"},
        ]);

    




class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        
    this.handleChange15 = function(e) {  window.statemanagement.setState(15, e.target.value); this.setState({});};

                datasource1.addListener(() => this.setState({}))
    

    this.handleChange5 = function(e) {  window.statemanagement.setState(5, e.target.value); this.setState({});};
  
    }

    render() {
        return (
              <div>
             <h4>red </h4>
              <h1>Jeroen</h1>
              <h2>[[siebe]]</h2>
                <input type="text" placeholder={String('undefined')} value={window.statemanagement.getState(15) || ''} onChange={(e) => this.handleChange15(e)}></input><input type="submit" value="search" onClick={(e) => {let event = window.statemanagement.getState(15);datasource1.search(event);
}}></input>


        <div>{datasource1.getList()
.map(element => <div onClick={() => {let event = element;  datasource1.select(event);
}} key={JSON.stringify(element)}> { element.title } </div>)}</div>
    
<div>SELECTED ITEM: {JSON.stringify(datasource1.getValue()
)}</div>

<input type="text" placeholder={String(JSON.stringify(datasource1.getValue()
))} value={window.statemanagement.getState(5) || ''} onChange={(e) => this.handleChange5(e)}></input><input type="submit" onClick={(e) => {let event = window.statemanagement.getState(5);datasource1.add(event);
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
    