import 'package:flutter/material.dart';
 
 


import 'dart:async';





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
 
 


class TimerDataSource extends ChangeNotifier {
  int _value = 0;
  TimerDataSource() {
    Timer.periodic(Duration(seconds: 1), (t){
        this.value = this._value + 1;
  });
  }
  set value(v) {
      _value = v;
      notifyListeners();
      
  }

  reset(argument) {
    this.value = 0;
    notifyListeners(); 
  }
  
  refresh(argument) {
    notifyListeners(); 
  }

  setValue(v) { _value = v; notifyListeners(); }
  getValue() { return _value; }
}
             


 
 


TimerDataSource datasource1 = TimerDataSource();





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
             
 
Row(
          children: <Widget>[
             
 ElevatedButton( onPressed: () { dynamic event; datasource1.reset(event);
 } , child: const Text("reset")), 
 GestureDetector(onTap:(){ dynamic event; }, child:Text("${datasource1.getValue()
}", style: Theme.of(context).textTheme.headlineMedium)), 
 
          ],
    ), 
 
          ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}