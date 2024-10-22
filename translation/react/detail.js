//#pragma: setup
this.detail_nothingselected = `[[emptylabel]]`
//#pragma: execution

<div style={{marginTop:50}}>{datasource[[source]]?.getValue()?.title || this.detail_nothingselected} {datasource[[source]]?.getValue()?.subtitle} {datasource[[source]]?.getValue()?.detailtext}</div>
       <div style={{width:300}}><img style={{width:'100%'}} src={datasource[[source]]?.getValue()?.image} /></div>