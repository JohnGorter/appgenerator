//#pragma: declaration
class ApiDataSource {
  #listeners
  #url;
  #response

  constructor(url){  
      this.#listeners = []
      this.#url = url;
      this.#response =  []
  }
        
  setValue(url){ this.#url = url; 
    async () => {
      this.#response = await (await fetch(this.#url)).json(); 
      this.notifyListeners(); 
    }
   }
  getValue() { 
    (async () => {
      this.#response = await (await fetch(this.#url)).json(); 
      this.notifyListeners(); 
    })(); 
    return this.#response
  }
  
            
  addListener(l){
      this.#listeners.push(l)
  }

  notifyListeners(){
      this.#listeners.forEach(l => {
          l(this.#response);
      })
  }
}
             
//#pragma: global
const datasource[[id]] = new ApiDataSource(`[[url]]`);

//#pragma: setup
datasource[[id]].addListener(() => {
  this.setState({});
});