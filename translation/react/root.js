

var link = document.createElement('style');
link.innerHTML = `
// [[styles]]
`;
document.head.appendChild(link);

// [[global]]

class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        [[setup]]
    }

    render() {
        return (
              <div>
              <h1>[[title]]</h1>
                [[children]] 
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