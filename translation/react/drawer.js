
//#pragma: declaration
let MyDrawer = ({text, click}) => <div onClick={click}>{text}</div>


//#pragma: global
class drawerState {
    draweritems = []; 
    _selected = 0;
    set selected(value) {  this._selected = this.draweritems.findIndex(d => d.id == value) } 
    get selected() { return this.draweritems[this._selected];} 
}


//#pragma: styles
.drawer { transition:all 0.2s ease-in-out;will-change:transform;transform:translate(-200px);background-color:red; position:absolute;height:100%;width:200px;left:0px;top:0px}
.drawer.shown { transform:translate(0px); }
.content { width:100%; height:100%}


//#pragma: setup
this.autohide = false || (`[[autohide]]`.length > 0 && `[[autohide]]` != `false`);
drawerState.draweritems = [
    [[drawer]]
]
document.addEventListener('clock', (e)=>{
    if (e.target.classList.contains("draweritem")) return;
    if (e.target.classList.contains("drawer")) return;
    console.log('hide'); document.querySelector(".drawer").classList.remove('shown')
})


//#pragma: execution
<div className="drawer">
    [[drawer]]
</div>
<div className="content">
    <div onClick={ (e) => { document.querySelector(".drawer").classList.add('shown'); e.preventDefault();e.stopPropagation();} }>show drawer</div>
    [[drawer.selected.children]]
</div>


//#pragma: example
{ "drawer": { "id":"13", 
    "drawer":[
      {"label": { "id":"23", "label":"test in drawer"}}
    ], 
    "children": [
      {"label": { "id":"23", "label":"test in content"}}
    ] 
}}