//#pragma: imports
import 'dart:convert';

//#pragma: execution
DetailWidget(),

//#pragma: declaration
class DetailWidget extends StatefulWidget {

  @override createState() => _DetailWidgetState();
}

class _DetailWidgetState extends State<DetailWidget> {
late Widget child; 
@override initState() {
  super.initState(); 
  child = Container(height:250 ,child:Column(children:[ Text("${datasource[[source]].getValue()?.title}  ${datasource[[source]].getValue()?.subtitle} ${datasource[[source]].getValue()?.detailtext} "), if (datasource[[source]].getValue()?.image != "") Container(width:300, child:Image.network(datasource[[source]].getValue()?.image ?? "")) ]));
  datasource[[source]].addListener((){
    child = Container(height:250 ,child:Column(children:[ Text("${datasource[[source]].getValue()?.title}  ${datasource[[source]].getValue()?.subtitle} ${datasource[[source]].getValue()?.detailtext} "), if (datasource[[source]].getValue()?.image != "") Container(width:300, child:Image.network(datasource[[source]].getValue()?.image ?? "")) ]));
    if (mounted) setState((){});
  });
}

  @override 
  Widget build (BuildContext context) {
  return child;
  }
} 
 