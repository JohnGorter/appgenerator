//#pragma: config 
{
    defaultGetter:"getList",
    defaultAction:"select"
}

//#pragma: execution 
 <div>{datasource[[source]].getList().map(element => <div onClick={() => {let event = element;  ##TRIGGERS##}} key={JSON.stringify(element)}> <b>{ element.title  } </b><small style={{marginBottom:10}}>{ element.subtitle  } </small></div>)}</div>
   