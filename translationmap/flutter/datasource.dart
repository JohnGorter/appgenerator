import "package:flutter/material.dart";

//#pragma: declaration
class DataSource extends ChangeNotifier {
  List<String> _value = [];
  List<String> filteredvalue = [];
  List<String> get value => _value;
  set value(v) {
      _value = v;
      notifyListeners();
      
  }

  add(argument) {
    _value.add(argument);
    notifyListeners(); 
  }
  
  filter(f){
    if (f == "") filteredvalue = _value;
    else filteredvalue = _value.where((v) => v.indexOf(f) >= 0).toList();
    statemanagement.setState([[stateid]], filteredvalue);
    print('filtered@');
    notifyListeners();
  }

  refresh(argument) {
    notifyListeners(); 
  }

  List<String> getValue() => filteredvalue; 
  setValue(v) { _value = v; notifyListeners(); }

}
             
//#pragma: global
DataSource datasource[[id]] = DataSource();

//#pragma: setup
datasource[[id]].value = List.generate(10, (i) => "John Gorter $i");
datasource[[id]].filteredvalue = datasource[[id]]._value;
statemanagement.setState([[stateid]], datasource[[id]].filteredvalue);
datasource[[id]].addListener((){
  setState(() {});
});