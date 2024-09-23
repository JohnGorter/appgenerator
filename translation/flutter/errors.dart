//#pragma: execution
Expanded(
  child:ListView(
    children:##SOURCE##
.indexed.map((v) => ListTile(
      title:Text('${v.$2}', style: TextStyle(color:Colors.red, fontSize: 12),))).toList())),



//#pragma: config
{
  defaultGetter:'getErrors'
}