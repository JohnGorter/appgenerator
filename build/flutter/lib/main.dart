import 'package:flutter/material.dart';
 
 



import 'dart:convert';
import 'dart:convert';

class StringWrapper {
  late dynamic value;
  StringWrapper([dynamic value]) {
    this.value = value ?? "";
  }
}

class StateEntry {
  late int id;
  dynamic value;
  StateEntry({required this.id, this.value});
}
class StateMnmgt {
  List<StateEntry> state = []; 
  getState(id) {
    return state.where((s) => s.id == id).first.value;
  }
  setState(int id, value) {
    for (var item in state) {
        if (item.id == id) { item.value = value; return; }  
    }
    state.add(StateEntry(id:id, value:value));
  } 
}

StateMnmgt statemanagement = StateMnmgt(); 
 
 


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
             


    List<ListTile> listviewchildren3= [];

 
 


DataSource datasource1 = DataSource();






void main() { 
    runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App Generator Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter App Generator Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
   @override
  void initState() {
    
datasource1._list = List.generate(10, (i) => ListItem(title:"John${i}", subtitle:"Gorter"));
datasource1.filteredvalue = datasource1._list;
// statemanagement.setState([[stateid]], datasource1.filteredvalue);
datasource1.addListener((){
  setState(() {});
});

    listviewchildren3.add(ListTile(title:Text("john")));
 
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextField(  obscureText: false,  decoration:  InputDecoration( border: OutlineInputBorder()) ,onChanged: (value) => statemanagement.setState(15, value),),TextButton(child:Text("search"), onPressed:() { dynamic event = statemanagement.getState(15); datasource1.search(event);
;}),
Expanded(child:ListView(children:datasource1.getList()
.indexed.map((v) => ListTile(onTap: () { dynamic event = v.$2;datasource1.select(event);
 },title:Text('${v.$2.title}'))).toList())),
Text("${jsonEncode(datasource1.getValue()
)}"),
TextField(  obscureText: false,  decoration:  InputDecoration( border: OutlineInputBorder(), labelText: "Name", hintText: "${jsonEncode(datasource1.getValue()
)}") ,onChanged: (value) => statemanagement.setState(5, value),),TextButton(child:Text("save"), onPressed:() { dynamic event = ListItem(title:statemanagement.getState(5), subtitle:statemanagement.getState(5)); datasource1.add(event);
;}),

          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}