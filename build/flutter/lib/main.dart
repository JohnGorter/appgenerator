import 'package:flutter/material.dart';
 
 

import 'package:http/http.dart' as http;
import 'dart:convert';

class StringWrapper {
  late dynamic value;
  StringWrapper([dynamic? value]) {
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
 

class ApiDatasource extends ChangeNotifier {
  String url = "";
  List<dynamic>  response = [];
  ApiDatasource({this.url = ""}) ;

  set ur(v) {
      url = v;
      notifyListeners();
      
  }

  
  Future<List<dynamic>> load() async {
    () async { response = json.decode(await http.read(Uri.parse(url))); notifyListeners(); }();
    return response;
  }

  setValue(u)  { url = u; () async { response = json.decode(await http.read(Uri.parse(url))); notifyListeners(); }();}
  List<dynamic>  getValue()  { return response; }
}
             


    List<ListTile> listviewchildren3= []; 
 

ApiDatasource datasource1 = ApiDatasource(url:'http://localhost:1337/cars');




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
    
datasource1.addListener((){
  print("new");
  setState(() {});
});
datasource1.load(); 

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
            Expanded(child:ListView(children:datasource1.getValue()
.indexed.map((v) => ListTile(onTap: () { dynamic event = v.$1; },title:Text('${v.$2}'))).toList())),

          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}