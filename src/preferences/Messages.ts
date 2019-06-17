const fs =require('fs');
const path =require('path');

const pathjson = path.resolve(__dirname,'../config/lang/fa.json');
const data = fs.readFileSync(pathjson);
const Messages = JSON.parse(data);

export default Messages; 