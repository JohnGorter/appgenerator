

var link = document.createElement('style');
link.innerHTML = `
 
 
.drawer { transition:all 0.2s ease-in-out;will-change:transform;transform:translate(-200px);background-color:red; position:absolute;height:100%;width:200px;left:0px;top:0px}
.drawer.shown { transform:translate(0px); }
.content { width:100%; height:100%}




.draweritem { display:flex;align-items:center; justify-content:center;width:100%;height:100px;}
.draweritem.selected { display:flex;align-items:center; justify-content:center;width:100%;height:100px;background-color:pink;}






.draweritem { display:flex;align-items:center; justify-content:center;width:100%;height:100px;}
.draweritem.selected { display:flex;align-items:center; justify-content:center;width:100%;height:100px;background-color:pink;}






.draweritem { display:flex;align-items:center; justify-content:center;width:100%;height:100px;}
.draweritem.selected { display:flex;align-items:center; justify-content:center;width:100%;height:100px;background-color:pink;}





`;
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
        this.mapping = "title:make,subtitle:model,image:image"
        this.#selected;
    }
          
    applyMapping(item, data) {
      let maps = this.mapping.split(",")
      if (maps.length > 0) {
         for (let row of maps) {
            let fields = row.split(":")
            if (fields.length > 0)
                if (fields[0].trim() == item) return data[fields[1]];
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
               
  

let MyDrawer = ({text, click}) => <div onClick={click}>{text}</div>





 
 
  const datasource1 = new ApiDataSource(`http://localhost:1337/cars`);
  
  
  

class drawerState {
    draweritems = []; 
    _selected = 0;
    set selected(value) {  this._selected = this.draweritems.findIndex(d => d.id == value) } 
    get selected() { return this.draweritems[this._selected];} 
}



const datasource = undefined;

class App extends window.React.Component
{
    constructor(props){
        super(props); 
        this.state = {}; 
        
  datasource1.addListener(() => {
    this.setState({});
  });
  datasource1.load();

this.autohide = false || (`false`.length > 0 && `false` != `false`);
drawerState.draweritems = [
    
<div className="draweritem " onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM hello world 1 </div>


<pre className="example">{`
`}</pre>

<div className="draweritem " onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM hello world 2 </div>


<pre className="example">{`
`}</pre>

<div className="draweritem " onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM hello world 3 </div>


<pre className="example">{`
`}</pre>

]
document.addEventListener('clock', (e)=>{
    if (e.target.classList.contains("draweritem")) return;
    if (e.target.classList.contains("drawer")) return;
    console.log('hide'); document.querySelector(".drawer").classList.remove('shown')
})




this.detail_nothingselected = `leeg`


    }

    render() {
        return (
              <div>
              <h1>Car Selector</h1>
                
<div className="drawer">
    
<div className="draweritem " onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM hello world 1 </div>


<pre className="example">{`
`}</pre>

<div className="draweritem " onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM hello world 2 </div>


<pre className="example">{`
`}</pre>

<div className="draweritem " onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM hello world 3 </div>


<pre className="example">{`
`}</pre>

</div>
<div className="content">
    <div onClick={ (e) => { document.querySelector(".drawer").classList.add('shown'); e.preventDefault();e.stopPropagation();} }>show drawer</div>
    [[drawer.selected.children]]
</div>


<pre className="example">{`
{ "drawer": { "id":"13", 
    "drawer":[
      {"label": { "id":"23", "label":"test in drawer"}}
    ], 
    "children": [
      {"label": { "id":"23", "label":"test in content"}}
    ] 
}}`}</pre>
 
 <div>{datasource1.getList().map(element => <div onClick={() => {let event = element;  datasource1.select(event);
}} key={JSON.stringify(element)}> <b>{ element.title  } </b><small style={{marginBottom:10}}>{ element.subtitle  } </small></div>)}</div>
   


<div style={{marginTop:50}}>{datasource1?.getValue()?.title || this.detail_nothingselected} {datasource1?.getValue()?.subtitle} {datasource1?.getValue()?.detailtext}</div>
       <div style={{width:300}}><img style={{width:'100%'}} src={datasource1?.getValue()?.image} /></div>
 
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