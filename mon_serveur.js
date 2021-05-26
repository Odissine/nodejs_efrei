const http = require('http');
const url = require('url');
const express = require('express')
const app = express()
const path = require('path');

const {create_connection, get_users, add_user} = require('./mysql.js');
const connection = create_connection();

const hostname = '127.0.0.1';
const port = 3000;

//const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.listen(3000, function () {
    console.log('Votre app est disponible sur localhost:3000 !');
})

app.post('/process-data', function(req, res) {
    var post_body = req.body;
    console.log(post_body);
    add_user(connection, 'cyril', '123456', post_body.email)
    get_users(connection).then(data => {
        res.status(200).json(data);
    })
})

// Dossier Viruel TOTO qui permet d'accèder aux fichiers et/ou sous repertoires du dossier public
app.use(express.static('public'));
//ou
// Pas de dossier virtuel créé .. un accès direct des la racine au dossier public
//app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('HOME');
   })

app.get('/page-2', function (req, res) {
    res.send('Page 2');
})

app.get('/user-list', function(req, res) {
    get_users(connection).then(data => {
        res.status(200).json(data);
    })
});

app.get('/premier-json', function (req, res) {
    //res.type('text')
    jsonFile = [{"age":22, "nom":"Toto"},{"age":32, "nom":"Tarzan"}]
    jsonString = JSON.stringify(jsonFile);
    res.type('text').json(jsonFile);
    //res.send(jsonString)
})

app.get('/premier-html', function (req, res) {
    res.render('home');
})

app.get('/html-brut', function (req, res) {
    
    res.set('Content-Type', 'text/plain');
    res.type('text');
    
    res.send('<html><body><p>Coucou</p></body></html>');
})



app.get('/moncv', function(req, res) {
    var options = {
        root: path.join(__dirname, 'public')
    };
    res.sendFile('cv.html', options, function(err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent');
        }
    });
})

app.use(function(request, response, next) {
    response.status(404).send('Erreur ... Page inexistante !');
})

/*
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    var urlParts = new URL('http://'+hostname+':'+port);

    switch(req.url) {
        case "/":
            res.statusCode = 200;    
            res.end('HOME PAGE');
            break;

        case "/test":
            res.statusCode = 200;    
            res.end('<html><body><p>Coucou</p></body></html>');
            break;
        
        case "/node":
            res.statusCode = 200;    
            res.end('NODE');
            break;

        default:
            res.statusCode = 404;
            res.end('ERREUR 404')
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/