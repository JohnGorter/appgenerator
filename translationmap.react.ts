
export const translationmap:any = new Map<String, Object>(); 


translationmap.set("root", { template: `

// [[global]]

class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        { /* [[setup]] */ }  
    }

    render() {
        return (
              <div>
             <h4>[[color]] </h4>
              <h1>[[title]]</h1>
              <h2>[[subtitle]]</h2>
                { /* [[local]] */ } 
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
    `});

translationmap.set("numberdatasource_global", { scope:'global', template: `
    let datasource[[id]] = new class {
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
    `})

    translationmap.set("numberdatasource_setup", { scope:'setup', template: `
        datasource[[id]].addListener(() => this.setState({}))
        `})

    translationmap.set("datasource_global", { scope:'global', template: `
            let datasource[[id]] = new class {
            #listeners
            #value;
            #filtered;
            constructor(initialvalue){  
                this.#listeners = []
                this.#value = initialvalue;
                this.#filtered = initialvalue;
            }
        
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

    `})
        
    translationmap.set("datasource_setup", { scope:'setup', template: `
                datasource[[id]].addListener(() => this.setState({}))
    `})


    translationmap.set("detaildatasource_global", { scope:'global', template: `
                    let datasource[[id]] = new class {
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
    `})
                
    translationmap.set("detaildatasource_setup", { scope:'setup', template: `
                        datasource[[id]].addListener(() => this.setState({}))
    `})

                
translationmap.set("button_declaration", { scope:'global', 
    template: `let MYButton = ({click, children}) => <button onClick={click}>{children}</button>
`})
translationmap.set("list_execution", { scope:'local', 
    template: `
        <div>{datasource[[source]].getValue().map(element => <div onClick={() => {let event = element;  ##TRIGGERS##}} key={element}> { element } </div>)}</div>
    `
})


translationmap.set("detail_execution", { scope:'global', 
     template: `<div>SELECTED ITEM: {##SOURCE##}</div>
`})

translationmap.set("input_execution", { scope:'global', 
    template: `<input type="text" placeholder={String(##SOURCE##)} value={window.statemanagement.getState([[id]]) || ''} onChange={(e) => this.handleChange[[id]](e)}></input><input type="submit" onClick={(e) => {let event = window.statemanagement.getState([[id]]);##TRIGGERS##}}></input>
`})

translationmap.set("input_setup", { scope:'global', 
    template: `
    this.handleChange[[id]] = function(e) {  window.statemanagement.setState([[id]], e.target.value); this.setState({});};`})



translationmap.set("search_execution", { scope:'global', 
    template: `<input type="text" placeholder={String(##SOURCE##)} value={window.statemanagement.getState([[id]]) || ''} onChange={(e) => this.handleChange[[id]](e)}></input><input type="submit" value="search" onClick={(e) => {let event = window.statemanagement.getState([[id]]);##TRIGGERS##}}></input>
`})

translationmap.set("search_setup", { scope:'global', 
    template: `
    this.handleChange[[id]] = function(e) {  window.statemanagement.setState([[id]], e.target.value); this.setState({});};`})

translationmap.set("button_execution", { scope:'local', 
    template: "<div>Button <MYButton click={() => {##TRIGGERS##}}>[[label]]</MYButton></div>"
})

translationmap.set("label_declaration", { scope:'global', 
    template: `let MyLabel = ({text, click}) => <div onClick={click}>value: {text}</div>
`})
translationmap.set("label_execution", { scope:'local', 
    template: "<div><MyLabel text={##SOURCE##} click={() => {##TRIGGERS##}}> </MyLabel></div>"
})

translationmap.set("header_execution", { scope:'local', 
    template: "<marquee>generic placeholder [[label]]</marquee>"
})

translationmap.set("footer_execution", { scope:'local', 
    template: "<marquee>generic placeholder [[label]]</marquee>"
})

translationmap.set("arjan_execution", { scope:'local', 
    template: "<b>[[label]]</b>"
})