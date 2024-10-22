
//#pragma: execution
<input type="text" placeholder={String(datasource?[[source]].getValue())} value={window.statemanagement.getState([[id]]) || ''} onChange={(e) => this.handleChange[[id]](e)}></input><input type="submit" value="search" onClick={(e) => {let event = window.statemanagement.getState([[id]]);##TRIGGERS##}}></input>

//#pragma: config
{
      defaultAction:"search"
}
  
//#pragma: setup
this.handleChange[[id]] = function(e) {  window.statemanagement.setState([[id]], e.target.value); this.setState({});};