//#pragma: declaration
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
        this.mapping = "[[mapping]]"
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
               
  //#pragma: global
  const datasource[[id]] = new ApiDataSource(`[[url]]`);
  
  
  //#pragma: setup
  datasource[[id]].addListener(() => {
    this.setState({});
  });
  datasource[[id]].load();