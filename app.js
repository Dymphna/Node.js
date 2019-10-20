const express    = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql      = require('mysql');
const path       = require('path');
const app        = express();


const {getHomePage} = require('./routes/index');
const {addVendorPage, addVendor, deleteVendor, editVendor, editVendorPage} = require('./routes/users')

const port = 5000;

const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password : '',
    database : 'users' 
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conneted to database');
});

global.db = db;


//middlewre

app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our views
app.set('view engine', 'ejs');// configure template engine
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //parse from data lient
app.use(express.static(path.join(__dirname, 'public')));// publi folder
app.use(fileUpload()); //file upload

//routes for the app

app.get('/', getHomePage);
app.get('/add', addVendorPage);
app.get('/edit/:id', editVendorPage);
app.get('/delete/:id', deleteVendor);
app.post('/add', addVendor);
app.post('/edit/:id', editVendor);

//set the app to listen on the port
app.listen(port, ()=> {
  console.log(`Server running on port: ${port}`);
});