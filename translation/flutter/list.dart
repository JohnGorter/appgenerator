//#pragma: setup



//#pragma: execution
ListWidget(),

//#pragma: declaration
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
    child =  datasource[[source]].getList().length > 0 ? Expanded(child:ListView(children:datasource[[source]].getList().indexed.map((v) => ListTile(onTap: () { dynamic event = v.$2;##TRIGGERS## },title:Text('${v.$2.title}'), subtitle:Text('${v.$2.subtitle}'))).toList())) : Expanded(child:Container(alignment:Alignment.center, color:Colors.green, child:Text('no data for list')));
    datasource[[source]].load(); 
    datasource[[source]].addListener(() {
        child =  datasource[[source]].getList().length > 0 ? Expanded(child:ListView(children:datasource[[source]].getList().indexed.map((v) => ListTile(onTap: () { dynamic event = v.$2;##TRIGGERS## },title:Text('${v.$2.title}'), subtitle:Text('${v.$2.subtitle}'))).toList())) : Expanded(child:Container(alignment:Alignment.center, color:Colors.green, child:Text('no data for list')));
        setState((){});
    }); 
  }
  @override
  Widget build(BuildContext context) {
    return child;
  }
}

//#pragma: config
{
    defaultAction:"select",
}
