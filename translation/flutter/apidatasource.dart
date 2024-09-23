//#pragma: imports
import 'package:http/http.dart' as http;
import 'dart:convert';


//#pragma: declaration
class ApiDatasource extends ChangeNotifier {
  String url = "";
  String mapping = "[[mapping]]";
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
             
//#pragma: global
ApiDatasource datasource[[id]] = ApiDatasource(url:'[[url]]');

//#pragma: setup
datasource[[id]].addListener((){
  setState(() {});
});
datasource[[id]].load(); 