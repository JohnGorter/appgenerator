
//#pragma: declaration
let MyDrawer = ({text, click}) => <div onClick={click}>{text}</div>


//#pragma: styles
.drawer { transition:all 2s ease-in-out;will-change:transform;transform:translate(-200px);background-color:red; position:absolute;height:100%;width:200px;left:0px;top:0px}
.drawer.shown { transform:translate(0px); }



//#pragma: execution
<div className="drawer">
    [[drawer]]
</div>
<div className="content">
    [[children]]
</div>