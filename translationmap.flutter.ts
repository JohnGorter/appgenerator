
export const translationmap:any = new Map<String, Object>(); 


translationmap.set("root", { template: `

import 'package:flutter/material.dart';

class StringWrapper {
  StringWrapper({this.value:String = ""})
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


// [[global]]

void main() { 
    runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
   @override
  void initState() {
    { /* [[setup]] */ } 
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          //
          // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
          // action in the IDE, or press "p" in the console), to see the
          // wireframe for each widget.
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            { /* [[local]] */ }
          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
`});


translationmap.set("numberdatasource_global", { scope:'global', template: `
   NumberDataSource datasource[[id]] = NumberDataSource();`
  })

translationmap.set("numberdatasource_setup", { scope:'setup', template: `
        datasource[[id]].addListener((){
          setState(() {});
        });
  `
  })

translationmap.set("numberdatasource_declaration", { scope:'global', template: `
            class NumberDataSource extends ChangeNotifier {
             int _value =  0;
             int get value => _value;
             set value(v) {
                 _value = v;
                 notifyListeners();
                
             }
     
             _refresh(e) {
               _value = _value + 1;
             }
     
             refresh(e) {
               _refresh(e); 
               notifyListeners(); 
             }
     
             int getValue() => _value; 
             setValue(v) { _value = v; notifyListeners(); }
     
             }
         `
  })

         translationmap.set("detaildatasource_declaration", { scope:'global', template: `
            class DetailDataSource extends ChangeNotifier {
             String _detail =   "John Gorter";
             String get detail => _detail;
             set detail(d) {
                 _detail = d;
                 notifyListeners();
                
             }
     
             _refresh(e) {
               _detail = statemanagement.getState([[stateid]])[e];
             }
     
             refresh(e) {
               _refresh(e); 
               notifyListeners(); 
             }
     
             dynamic getValue() => _detail; 
             setValue(d) { _detail = d; notifyListeners(); }
     
             }
         `})
     
     
     translationmap.set("detaildatasource_global", { scope:'global', template: `
         DetailDataSource datasource[[id]] = DetailDataSource();`
       })
     
         translationmap.set("detaildatasource_setup", { scope:'setup', template: `
             datasource[[id]].addListener((){
               setState(() {});
             });
             `})

             translationmap.set("datasource_declaration", { scope:'global', template: `
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
                 }
                 filter(f){
                    if (f == "") filteredvalue = _value;
                    else filteredvalue = _value.where((v) => v.indexOf(f) >= 0).toList();
                    statemanagement.setState([[stateid]], filteredvalue);
                    notifyListeners();
                 }
         
                 refresh(argument) {
                   notifyListeners(); 
                 }
         
                 List<String> getValue() => filteredvalue; 
                 setValue(v) { _value = v; notifyListeners(); }
         
                 }
             `})
         
         
         translationmap.set("datasource_global", { scope:'global', template: `
             DataSource datasource[[id]] = DataSource();`
           })
         
             translationmap.set("datasource_setup", { scope:'setup', template: `
               datasource[[id]].value = List.generate(10, (i) => "John Gorter $i");
               datasource[[id]].filteredvalue = datasource[[id]]._value;
               statemanagement.setState([[stateid]], datasource[[id]].filteredvalue);
               
                 datasource[[id]].addListener((){
                   setState(() {});
                 });
                 `})

translationmap.set("button_execution", { scope:'local', 
    template: 'ElevatedButton( onPressed: () { dynamic event; ##TRIGGERS## } , child: const Text("[[label]]")),'
})

translationmap.set("list_declaration", { scope:'local', 
    template: `
    List<ListTile> listviewchildren[[id]]= [];`,
})

translationmap.set("list_setup", { scope:'local', 
    template: `
    listviewchildren[[id]].add(ListTile(title:Text("john")));`
})
translationmap.set("list_execution", { scope:'local', 
    template: "Expanded(child:ListView(children:##SOURCE##.indexed.map((v) => ListTile(onTap: () { dynamic event = v.$1;##TRIGGERS## },title:Text('${v.$2}'))).toList())),",
})

translationmap.set("label_execution", { scope:'local', 
    template: 'GestureDetector(onTap:(){ dynamic event;##TRIGGERS## }, child:Text("${##SOURCE##}", style: Theme.of(context).textTheme.headlineMedium)),'
})


translationmap.set("detail_execution", { scope:'local', 
    template: `Text(##SOURCE##),`
})

translationmap.set("header_execution", { scope:'local', 
  template: `Text("[[label]]"),`
})

translationmap.set("footer_execution", { scope:'local', 
     template: `Text("[[label]]"),`
})

translationmap.set("input_execution", { scope:'global', 
  template: 'TextField(  obscureText: false,  decoration:  InputDecoration( border: OutlineInputBorder(), labelText: "Name", hintText: "${##SOURCE##}") ,onChanged: (value) => statemanagement.setState([[id]], value),),TextButton(child:Text("save"), onPressed:() { dynamic event = statemanagement.getState([[id]]); ##TRIGGERS##;}),'})


  translationmap.set("search_execution", { scope:'global', 
    template: 'TextField(  obscureText: false,  decoration:  InputDecoration( border: OutlineInputBorder()) ,onChanged: (value) => statemanagement.setState([[id]], value),),TextButton(child:Text("search"), onPressed:() { dynamic event = statemanagement.getState([[id]]); ##TRIGGERS##;}),'})

    translationmap.set("arjan_execution", { scope:'local', 
      template: `Text("hi i am arjan")`
  })
