//#pragma: imports
import 'dart:async';

//#pragma: declaration
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
             
//#pragma: global
TimerDataSource datasource[[id]] = TimerDataSource();

//#pragma: setup
datasource[[id]].addListener((){
  print("new");
  setState(() {});
});