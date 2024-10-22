//#pragma: setup 
drawerstate.items = [
  [[drawer]]
];
drawerstate.addListener(() { this.setState((){}); });

//#pragma: global 
class DrawerState extends ChangeNotifier {
    bool autohide = false || ('false'.length > 0 && 'false' != 'false');
    bool _hide = false;
    int _selected = 0; 
    List<DrawerItem> items = [
      [[children]]
    ];
    bool get drawervisible => !_hide;
    void hide() {
      _hide = true; 
      notifyListeners();
    }
    void show() {
      _hide = false; 
      notifyListeners();
    }
    void toggle() {
      _hide = !_hide; 
      notifyListeners();
    }

    void setSelected(String id){
      _selected = items.indexOf(items.where((i) => i.id == id).first);
      notifyListeners();
    }
    get selected { 
      return items.length > 0 ?  items[_selected]: null; 
    }

}
DrawerState drawerstate = DrawerState();


//#pragma: declaration
class DrawerWidget extends StatefulWidget {
  final List<Widget> children;
  final List<Widget> drawer;

  DrawerWidget({super.key, required this.children, required this.drawer});

  @override
  State<DrawerWidget> createState() => _DrawerWidgetState();
}

class _DrawerWidgetState extends State<DrawerWidget> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(child:GestureDetector(
          onTap:(){ drawerstate.hide(); setState((){});},
          child:Stack(
              fit: StackFit.loose,
              children: [
                Positioned.fill(child:Container(alignment: Alignment.topRight, color:Colors.green, child:Column(children:[
                   
                    TextButton(child:Text("Show menu"), onPressed:(){ drawerstate.toggle(); setState((){}); }),
                    ...drawerstate.selected.children
                   
                ]))),
                AnimatedPositioned(duration:Duration(milliseconds: 200), left:drawerstate.drawervisible? 0: -300, top:0, width:300, height: MediaQuery.of(context).size.height, child: Container(color:Colors.red, child:
                Column(children:[
                    ...drawerstate.items
                ])))
              ])
            ));
  }
}



//#pragma: execution
DrawerWidget(children:[...drawerstate.selected.children], 
drawer:[
  ...drawerstate.items
])

