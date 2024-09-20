
export const translationmap:any = new Map<String, Object>(); 


translationmap.set("root", { template: `

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '[[style]]');
document.head.appendChild(link);

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
              <h2>[[siebe]]</h2>
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
            // console.log("l", l); 
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

translationmap.set("list_config", { config: {
    type:"list",
    defaultAction:"select"
}
})

translationmap.set("search_config", { 
    config: {
      defaultAction:"search"
    }
  })
  
  translationmap.set("input_config", { 
    config: {
      defaultAction:"add"
    }
  })


translationmap.set("list_execution", { scope:'local', 
    template: `
        <div>{##SOURCE##.map(element => <div onClick={() => {let event = element;  ##TRIGGERS##}} key={JSON.stringify(element)}> { element.title } </div>)}</div>
    `
})


translationmap.set("detail_execution", { scope:'global', 
     template: `<div>SELECTED ITEM: {JSON.stringify(##SOURCE##)}</div>
`})

translationmap.set("input_execution", { scope:'global', 
    template: `<input type="text" placeholder={String(JSON.stringify(##SOURCE##))} value={window.statemanagement.getState([[id]]) || ''} onChange={(e) => this.handleChange[[id]](e)}></input><input type="submit" onClick={(e) => {let event = window.statemanagement.getState([[id]]);##TRIGGERS##}}></input>
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
    template: `let MyLabel = ({text, click}) => <div onClick={click}>{text}</div>
`})
translationmap.set("label_execution", { scope:'local', 
    template: "<div><MyLabel text={##SOURCE##+'' || '[[label]]'} click={() => {##TRIGGERS##}}> </MyLabel></div>"
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