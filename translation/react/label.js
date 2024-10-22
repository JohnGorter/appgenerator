
//#pragma: declaration
let MyLabel = ({text, click}) => <div onClick={click}>{text}</div>
//#pragma: execution
<div><MyLabel text={datasource[[source]] ? datasource[[source]].getValue() +'' : '[[label]]'} click={() => {##TRIGGERS##}}> </MyLabel></div>