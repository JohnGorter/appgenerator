//#pragma: declaration
class TimerDataSource {
  #listeners
  #value;
  #filtered;

  constructor(initialvalue){  
      this.#listeners = []
      this.#value = initialvalue;
      globalThis.setInterval(()=>{
        this.#value = this.#value + 1; 
        console.log("adding 1 to value", this.#value);
        this.notifyListeners(); 
      }, 1000); 
  }
        
  setValue(v){ this.#value = v; this.notifyListeners(); }
  getValue() { return this.#value }
  reset() { 
    this.#value = 0; 
    this.notifyListeners(); 
   }
            
  addListener(l){
      this.#listeners.push(l)
  }

  notifyListeners(){
      console.log("number of listeners:", this.#listeners.length)
      this.#listeners.forEach(l => {
          l(this.#value);
      })
  }
}
             
//#pragma: global
const datasource[[id]] = new TimerDataSource(0);

//#pragma: setup
datasource[[id]].addListener(() => {
  this.setState({});
});