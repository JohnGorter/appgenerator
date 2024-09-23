

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'body { height:100%; } * { font-family:tahoma } div { display:flex;flex-flow:column;align-items:center;justify-content:center;height:100%}');
document.head.appendChild(link);

var link = document.createElement('style');
link.innerHTML = 'body { height:100%; } * { font-family:tahoma } div { display:flex;flex-flow:column;align-items:center;justify-content:center;height:100%}';
document.head.appendChild(link);

 
 

class ApiDataSource {
  #listeners
  #url;
  #response
  #errors
  #selected

  constructor(url){  
      this.#listeners = []
      this.#url = url;
      this.#response =  []
      this.#errors = []; 
      this.mapping = "title:make,subtitle:model,detailtext:detail,image:image"
      this.#selected;
  }
        
  applyMapping(item, data) {
    let maps = this.mapping.split(",")
    if (maps.length > 1) {
       for (let row of maps) {
          let fields = row.split(":")
          if (fields.length > 0)
              if (fields[0] == item) return data[fields[1]];
       }
    }
    return "- no mapping -";
  }

  setValue(url){ this.#url = url; 
    async () => {
      try {
      let res =  await (await fetch(this.#url)).json(); 
      let items = []
      for (let c of res) {
        let item = { 
          title: this.applyMapping("title", c),
          subtitle: this.applyMapping("subtitle", c)
        }
        items.push(item)
      }
      this.#response = items
    } catch (e) {
      this.#errors.push(e.message);
    }
      this.notifyListeners(); 
    }
   }
  load() { 
    (async () => {
      try {
      let res =  await (await fetch(this.#url)).json(); 
      let items = []
      for (let c of res) {
        let item = { 
          title: this.applyMapping("title", c),
          subtitle: this.applyMapping("subtitle", c),
          detailtext: this.applyMapping("detailtext", c),
          image: this.applyMapping("image", c),
          latitude: this.applyMapping("latitude", c),
          longitude: this.applyMapping("longitude", c),
          icon: this.applyMapping("icon", c),
          tag: this.applyMapping("tag", c)
        }
        items.push(item)
      }
      this.#response = items
    } catch (e) {
      this.#errors.push(e.message);
    }
      this.notifyListeners(); 
    })(); 
    return this.#response
  }

  select(eventelement) {
    // e contains the item
    this.#selected = this.#response.find(e => e.title == eventelement.title)
    this.notifyListeners(); 
  }

  getValue() { 
    return this.#selected
  }

  getList() { 
    return this.#response
  }

  getErrors() { return this.#errors }
            
  addListener(l){
      this.#listeners.push(l)
  }

  notifyListeners(){
      this.#listeners.forEach(l => {
          l(this.#response);
      })
  }
}
             



 
 

const datasource1 = new ApiDataSource(`http://localhost:1337/cars`);







class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        
datasource1.addListener(() => {
  this.setState({});
});
datasource1.load();
  
    }

    render() {
        return (
              <div>
              <h1>Car selector!</h1>
                
        <div>{datasource1.getList()
.map(element => <div onClick={() => {let event = element;  datasource1.select(event);
}} key={JSON.stringify(element)}> <b>{ element.title  } </b><small style={{marginBottom:10}}>{ element.subtitle  } </small></div>)}</div>
    
<div style={{marginTop:50}}>{datasource1.getValue()
?.title} {datasource1.getValue()
?.subtitle} {datasource1.getValue()
?.detailtext}</div>
        <div style={{width:300}}><img style={{width:'100%'}} src={datasource1.getValue()
?.image} /></div>


<div>{ datasource1.getErrors()
.map(e => <div style={{color:'red', fontSize:12}}>{ e}</div>)}</div>



 
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
    