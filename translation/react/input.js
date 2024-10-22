//#pragma: config
{
    defaultAction:"add"
}
  
//#pragma: execution
<input type="text" placeholder={String(JSON.stringify(datasource[[source]].getValue()))} value={window.statemanagement.getState([[id]]) || ''} onChange={(e) => this.handleChange[[id]](e)}></input><input type="submit" onClick={(e) => {let event = window.statemanagement.getState([[id]]);##TRIGGERS##}}></input>

//#pragma: setup
this.handleChange[[id]] = function(e) {  window.statemanagement.setState([[id]], e.target.value); this.setState({});};