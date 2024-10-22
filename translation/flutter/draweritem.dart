//#pragma: declaration
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

//#pragma: execution
DrawerItem(
  id:'[[id]]',
  children: [
       [[children]]
  ]
  ,
  child:Material(type: MaterialType.transparency, child:ListTile(selected:drawerstate.selected == '[[title]]', selectedTileColor:Colors.redAccent.shade200, title:Text("[[title]]"), onTap:(){  drawerstate.setSelected('[[id]]'); if (drawerstate.autohide) drawerstate.hide();}))
),