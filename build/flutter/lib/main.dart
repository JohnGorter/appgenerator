import 'package:flutter/material.dart';
 
 

import 'package:http/http.dart' as http;
import 'dart:convert';




import 'dart:convert';


 class Item {
      String title;
      String subtitle;
      String longitude;
      String latitude;
      String image;
      String detailtext;
      String tag; 
      String icon;
    
      Item({
        this.title = "", 
        this.subtitle = "",
        this.longitude = "",
        this.latitude = "",
        this.image = "",
        this.detailtext = "",
        this.tag = "",
        this.icon = ""
      });

      Item.fromJson(Map<String, dynamic> json) :
        title = json['title'],
        subtitle = json['subtitle'],
        longitude = json['longitude'],
        latitude = json['latitude'],
        image = json['image'],
        detailtext = json['detailtext'],
        tag = json['tag'],
        icon = json['icon'];
      
      Map<String, dynamic> toJson() {
        return {
          'title':title,
          'subtitle':subtitle,
          'longitude':longitude,
          'latitude':latitude,
          'image':image,
          'detailtext':detailtext,
          'tag':tag,
          'icon':icon
        };
      }
    }

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
 
 

class ApiDatasource extends ChangeNotifier {
  String url = "";
  String mapping = "title:make,subtitle:model,detailtext:detail,image:image";
  List<String> errors = [];
  Item? selected;

  List<dynamic>  response = [];
  ApiDatasource({this.url = ""}) ;

  set ur(v) {
      url = v;
      notifyListeners();
      
  }
  Future<List<dynamic>> load() async {
    () async { 
      try {
        response = json.decode(await http.read(Uri.parse(url))); notifyListeners();
      } catch(e) {
        print("ERROR: $e");
        errors.add("Timeout, API source is not available");
        notifyListeners();
     }
      }();
    return response;
  }

   select(eventelement) {
    // e contains the item
    selected = getList().where((e) => e.title == eventelement.title).first;
    notifyListeners(); 
  }

  setValue(u)  { url = u; () async { response = json.decode(await http.read(Uri.parse(url))); notifyListeners(); }();}
  Item  getValue()  { return selected ?? Item(); }
  List<Item>  getList()  {  return response.map((e) =>
      Item(
        title:e[_getMapping('title')] ?? "",
        subtitle: e[_getMapping('subtitle')]?? "",
        detailtext: e[_getMapping('detailtext')]?? "",
        tag: e[_getMapping('tag')]?? "",
        icon: e[_getMapping('icon')]?? "",
        longitude: e[_getMapping('longitude')]?? "",
        latitude: e[_getMapping('latitude')]?? "",
        image: e[_getMapping('image')]?? ""
      )).toList();
      }
  List<String> getErrors() => errors;

  _getMapping(String field){
    if (mapping.length > 0) {
      for (String map in mapping.split(",")) {
        if (map.split(":")[0] == field) return map.split(":")[1];
      }
    }
    return "";
  }
}
             


    //#pragma: declaration
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
      home: const MyHomePage(title: 'Car selector!'),
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
            Expanded(child:ListView(children:datasource1.getList()
.indexed.map((v) => ListTile(onTap: () { dynamic event = v.$2;datasource1.select(event);
 },title:Text('${v.$2.title}'), subtitle:Text('${v.$2.subtitle}'))).toList())),
Column(children:[ Text("${datasource1.getValue()
?.title}  ${datasource1.getValue()
?.subtitle} ${datasource1.getValue()
?.detailtext} "), Container(width:300, child:Image.network(datasource1.getValue()
?.image ?? "")) ]),

Expanded(
  child:ListView(
    children:datasource1.getErrors()

.indexed.map((v) => ListTile(
      title:Text('${v.$2}', style: TextStyle(color:Colors.red, fontSize: 12),))).toList())),





          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}