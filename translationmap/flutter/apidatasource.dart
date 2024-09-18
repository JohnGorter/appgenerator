//#pragma: imports
import 'package:http/http.dart' as http;
import 'dart:convert';

//#pragma: declaration
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
  List<dynamic>  getList()  { return response; }
}
             
//#pragma: global
ApiDatasource datasource[[id]] = ApiDatasource(url:'[[url]]');

//#pragma: setup
datasource[[id]].addListener((){
  setState(() {});
});
datasource[[id]].load(); 