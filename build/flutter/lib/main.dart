import 'package:flutter/material.dart';
 
 import 'package:http/http.dart' as http;
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
  String mapping = "title:make,subtitle:model,image:image";
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
             


class DrawerWidget extends StatefulWidget {
  final List<Widget> children;
  final List<Widget> drawer;

  DrawerWidget({super.key, required this.children, required this.drawer});

  @override
  State<DrawerWidget> createState() => _DrawerWidgetState();
}

class _DrawerWidgetState extends State<DrawerWidget> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(child:GestureDetector(
          onTap:(){ drawerstate.hide(); setState((){});},
          child:Stack(
              fit: StackFit.loose,
              children: [
                Positioned.fill(child:Container(alignment: Alignment.topRight, color:Colors.green, child:Column(children:[
                   
                    TextButton(child:Text("Show menu"), onPressed:(){ drawerstate.toggle(); setState((){}); }),
                    ...drawerstate.selected.children
                   
                ]))),
                AnimatedPositioned(duration:Duration(milliseconds: 200), left:drawerstate.drawervisible? 0: -300, top:0, width:300, height: MediaQuery.of(context).size.height, child: Container(color:Colors.red, child:
                Column(children:[
                    ...drawerstate.items
                ])))
              ])
            ));
  }
}





class DrawerItem extends StatelessWidget {
  final String id;
  final List<Widget> children;
  final Widget child; 
  const DrawerItem({super.key, required this.id, required this.child, required this.children});

  @override
  Widget build(BuildContext context) {
    return child;
  }
}



class ListWidget extends StatefulWidget {
  const ListWidget({super.key});

  @override
  State<ListWidget> createState() => _ListWidgetState();
}

class _ListWidgetState extends State<ListWidget> {
  late Widget child;
  @override void initState() {
    // TODO: implement initState
    super.initState();
    child =  datasource1.getList().length > 0 ? Expanded(child:ListView(children:datasource1.getList().indexed.map((v) => ListTile(onTap: () { dynamic event = v.$2;datasource1.select(event);
 },title:Text('${v.$2.title}'), subtitle:Text('${v.$2.subtitle}'))).toList())) : Expanded(child:Container(alignment:Alignment.center, color:Colors.green, child:Text('no data for list')));
    datasource1.load(); 
    datasource1.addListener(() {
        child =  datasource1.getList().length > 0 ? Expanded(child:ListView(children:datasource1.getList().indexed.map((v) => ListTile(onTap: () { dynamic event = v.$2;datasource1.select(event);
 },title:Text('${v.$2.title}'), subtitle:Text('${v.$2.subtitle}'))).toList())) : Expanded(child:Container(alignment:Alignment.center, color:Colors.green, child:Text('no data for list')));
        setState((){});
    }); 
  }
  @override
  Widget build(BuildContext context) {
    return child;
  }
}



class DetailWidget extends StatefulWidget {

  @override createState() => _DetailWidgetState();
}

class _DetailWidgetState extends State<DetailWidget> {
late Widget child; 
@override initState() {
  super.initState(); 
  child = Container(height:250 ,child:Column(children:[ Text("${datasource1.getValue()?.title}  ${datasource1.getValue()?.subtitle} ${datasource1.getValue()?.detailtext} "), if (datasource1.getValue()?.image != "") Container(width:300, child:Image.network(datasource1.getValue()?.image ?? "")) ]));
  datasource1.addListener((){
    child = Container(height:250 ,child:Column(children:[ Text("${datasource1.getValue()?.title}  ${datasource1.getValue()?.subtitle} ${datasource1.getValue()?.detailtext} "), if (datasource1.getValue()?.image != "") Container(width:300, child:Image.network(datasource1.getValue()?.image ?? "")) ]));
    if (mounted) setState((){});
  });
}

  @override 
  Widget build (BuildContext context) {
  return child;
  }
} 
  
 
ApiDatasource datasource1 = ApiDatasource(url:'http://localhost:1337/cars');


 
class DrawerState extends ChangeNotifier {
    bool autohide = false || ('false'.length > 0 && 'false' != 'false');
    bool _hide = false;
    int _selected = 0; 
    List<DrawerItem> items = [
      
    ];
    bool get drawervisible => !_hide;
    void hide() {
      _hide = true; 
      notifyListeners();
    }
    void show() {
      _hide = false; 
      notifyListeners();
    }
    void toggle() {
      _hide = !_hide; 
      notifyListeners();
    }

    void setSelected(String id){
      _selected = items.indexOf(items.where((i) => i.id == id).first);
      notifyListeners();
    }
    get selected { 
      return items.length > 0 ?  items[_selected]: null; 
    }

}
DrawerState drawerstate = DrawerState();




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
      home: const MyHomePage(title: 'Car Selector'),
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
 
drawerstate.items = [
  
DrawerItem(
  id:'1',
  children: [
       
ListWidget(),



  ]
  ,
  child:Material(type: MaterialType.transparency, child:ListTile(selected:drawerstate.selected == 'hello world 1', selectedTileColor:Colors.redAccent.shade200, title:Text("hello world 1"), onTap:(){  drawerstate.setSelected('1'); if (drawerstate.autohide) drawerstate.hide();}))
),

DrawerItem(
  id:'2',
  children: [
       
DetailWidget(),



  ]
  ,
  child:Material(type: MaterialType.transparency, child:ListTile(selected:drawerstate.selected == 'hello world 2', selectedTileColor:Colors.redAccent.shade200, title:Text("hello world 2"), onTap:(){  drawerstate.setSelected('2'); if (drawerstate.autohide) drawerstate.hide();}))
),

DrawerItem(
  id:'3',
  children: [
       
  ]
  ,
  child:Material(type: MaterialType.transparency, child:ListTile(selected:drawerstate.selected == 'hello world 3', selectedTileColor:Colors.redAccent.shade200, title:Text("hello world 3"), onTap:(){  drawerstate.setSelected('3'); if (drawerstate.autohide) drawerstate.hide();}))
),

];
drawerstate.addListener(() { this.setState((){}); });








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
            
DrawerWidget(children:[...drawerstate.selected.children], 
drawer:[
  ...drawerstate.items
])


 
          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}