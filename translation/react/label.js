
//#pragma: declaration
let MyLabel = ({text, click}) => <div onClick={click}>{text}</div>
//#pragma: execution
<div><MyLabel text={##SOURCE##+'' || '[[label]]'} click={() => {##TRIGGERS##}}> </MyLabel></div>