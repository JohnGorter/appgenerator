export const translationmap = new Map();
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

let root = window.ReactDOM.createRoot(document.querySelector("#main"))
root.render(<App />);
    ` });
translationmap.set("datasource_global", { scope: 'global', template: `
    let datasource[[id]] = new class {
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
        // console.log("number of listeners:", this.#listeners.length)
        this.#listeners.forEach(l => {
            // console.log("l", l); 
            l(this.#value);
        })
    }
}(1);
    ` });
translationmap.set("datasource_setup", { scope: 'setup', template: `
        datasource[[id]].addListener(() => this.setState({}))
        ` });
translationmap.set("button_declaration", { scope: 'global',
    template: `let MYButton = ({click, children}) => <button onClick={click}>{children}</button>
` });
translationmap.set("button_execution", { scope: 'local',
    template: "<div>Button <MYButton click={() => {##TRIGGERS##}}>Increment</MYButton></div>"
});
translationmap.set("label_declaration", { scope: 'global',
    template: `let MyLabel = ({text, click}) => <div onClick={click}>value: {text}</div>
` });
translationmap.set("label_execution", { scope: 'local',
    template: "<div><MyLabel text={##SOURCE##} click={() => {##TRIGGERS##}}> </MyLabel></div>"
});
translationmap.set("header_execution", { scope: 'local',
    template: "<h1>generic placeholder [[label]]</h1>"
});
//# sourceMappingURL=translationmap.js.map