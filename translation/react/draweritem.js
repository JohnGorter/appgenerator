//#pragma: declaration

//#pragma: styles
.draweritem { display:flex;align-items:center; justify-content:center;width:100%;height:100px;}
.draweritem.selected { display:flex;align-items:center; justify-content:center;width:100%;height:100px;background-color:pink;}




//#pragma: execution
<div className="draweritem [[selected]]" onClick={(e)=>{ [...document.querySelectorAll(".draweritem.selected")].map(e => e.classList.remove("selected")); e.target.classList.toggle('selected'); if (this.autohide) window.setTimeout(() => document.querySelector(".drawer").classList.remove('shown'), 250)}}> ITEM [[title]] </div>


//#pragma: example
