const express = require('express')
const app = express()

app.use(express.static('lib'));
app.use('/', express.static(__dirname + '/lib'));

app.listen(3001, () => console.log('Example app listening on port 3000!'))
