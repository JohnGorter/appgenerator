import 'package:flutter/material.dart';
 
 









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
         





 
 

   NumberDataSource datasource1 = NumberDataSource();

   NumberDataSource datasource4 = NumberDataSource();







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
          setState(() {});
        });
  

        datasource4.addListener((){
          setState(() {});
        });
  
 
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
            GestureDetector(onTap:(){ dynamic event; }, child:Text("${datasource4.getValue()
}", style: Theme.of(context).textTheme.headlineMedium)),
GestureDetector(onTap:(){ dynamic event;datasource4.refresh(event);
 }, child:Text("${datasource4.getValue()
}", style: Theme.of(context).textTheme.headlineMedium)),
GestureDetector(onTap:(){ dynamic event; }, child:Text("${datasource4.getValue()
}", style: Theme.of(context).textTheme.headlineMedium)),
ElevatedButton( onPressed: () { dynamic event; datasource1.refresh(event);
 } , child: const Text("increment me (no effect)")),
ElevatedButton( onPressed: () { dynamic event; datasource4.refresh(event);
 } , child: const Text("increment me")),

Text(
          "${'test'}"
    ),

          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}