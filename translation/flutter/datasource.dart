import "package:flutter/material.dart";

//#pragma: declaration
class ListItem {
  String title;
  String subtitle;
  ListItem({this.title = "", this.subtitle = ""});
  ListItem.fromJson(Map<String, dynamic> json) :
    title = json['title'],
    subtitle = json['subtitle'];
  
  Map<String, dynamic> toJson() {
    return {
      'title':title,
      'subtitle':subtitle
    };
  }
}

class DataSource extends ChangeNotifier {
  List<ListItem> _list = [];
  ListItem? _value;
  List<ListItem> filteredvalue = [];
  ListItem? get value => _value;
  ListItem? get selected => _value;
  ListItem? _selected ;

  set value(v) {
      _value = v;
      notifyListeners();
      
  }

  add(argument) {
    _list.add(argument);
    notifyListeners(); 
  }
  select(f) { this._selected = f;  notifyListeners();}
  search(f){
    if (f == "") filteredvalue = _list;
    else filteredvalue = _list.where((v) => v.title.indexOf(f) >= 0).toList();
   // statemanagement.setState([[stateid]], filteredvalue);
    print('filtered@');
    notifyListeners();
  }

  refresh(argument) {
    notifyListeners(); 
  }

  ListItem? getValue() => _selected; 
  List<ListItem> getList() => filteredvalue; 
  setValue(v) { _value = v; notifyListeners(); }

}
             
//#pragma: global
DataSource datasource[[id]] = DataSource();

//#pragma: setup
datasource[[id]]._list = List.generate(10, (i) => ListItem(title:"John${i}", subtitle:"Gorter"));
datasource[[id]].filteredvalue = datasource[[id]]._list;
// statemanagement.setState([[stateid]], datasource[[id]].filteredvalue);
datasource[[id]].addListener((){
  setState(() {});
});