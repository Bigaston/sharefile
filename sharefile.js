//Importation des modules
const fs = require("fs")
const path = require("path")
const mustache = require("mustache");
const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const mime = require('mime');
const bdd = require(__dirname + "/models/index.js")
const Op = bdd.Sequelize.Op;

//Importation des variables d'environnement
require('dotenv').config()

//Création du serveur Express
var app = express()

//Préparation du middleware pour upload les médias
const upload = multer({
    limits: {
      fileSize: process.env.MAX_SIZE,
    }
  });


//Utilisation du middleware bodyParser pour les formulaires
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//Configuration du cookie de session
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//Renvoit des fichiers statiques
app.get("/static/:file", (req, res) => {
	res.sendfile(path.join(__dirname, "web/static/", req.params.file))
})

app.get("/f/:file", (req, res) => {
	bdd.File.findOne({ where: {url: req.params.file} }).then((file) => {
		if (file != undefined) {
			res.sendFile(path.join(__dirname, "file/", file.nomDeFichier + "." + mime.getExtension(file.mime)))
		}
	})
})

//Envoit de fichier au serveur
app.post("/upload", upload.single('file'), async function (req, res) {
    if (req.session.username == undefined || req.session.username == "") {
        res.status(401).json({error: "Vous n'êtes pas connecté"})
    } else {
		bdd.File.create({
			nomDeFichier: Date.now(),
			titre: req.body.title,
			mime: req.file.mimetype,
			saveDuring: req.body.saveDuring,
			maxDl: req.body.maxDl,
			currentDl: 0,
			url: req.body.url
		}).then((file) => {
            const filePath = path.join(__dirname, '/file/', file.nomDeFichier + ".0." + mime.getExtension(req.file.mimetype));
	
			console.log(file)

            if (!req.file) {
              res.status(401).json({error: "Pas de fichier fourni"});
			}
			
            var wstream = fs.createWriteStream(filePath);
        
            wstream.write(req.file.buffer);
			wstream.end();
			
			template = fs.readFileSync(path.join(__dirname, "web/done.mustache"), "utf8")

			var renderObj = {
				addrLink: process.env.HOST + "/f/" + file.url
			}
		  
			res.setHeader("content-type", "text/html");
			res.send(mustache.render(template, renderObj))
		})
    }
})

//Connection
app.post("/authenticate", (req, res) => {
	if (req.body.password == undefined) {
		res.redirect("/login")
	} else {
		if (req.body.password == process.env.PASSWORD) {
			req.session.username = "admin"

			req.session.save(() => {
				res.redirect("/")
			})
		} else {
			template = fs.readFileSync(path.join(__dirname, "web/login.mustache"), "utf8")

			var renderObj = {
				errorMessage: "Le mot de passe est incorecte"
			}
		  
			res.setHeader("content-type", "text/html");
			res.send(mustache.render(template, renderObj))
		}
	}
})

//Page de connection (pour le moment simple mot de passe)
app.get("/login", (req, res) => {
	if (req.session.username == undefined) {
		template = fs.readFileSync(path.join(__dirname, "web/login.mustache"), "utf8")

		var renderObj = {}
	  
		res.setHeader("content-type", "text/html");
		res.send(mustache.render(template, renderObj))
	} else {
		res.redirect("/")
	}
})

//Page d'upload
app.get("/", (req, res) => {
	if (req.session.username == undefined) {
		res.redirect("/login")
	} else {
		res.sendfile(path.join(__dirname, "web/upload.html"))
	}
})

//Ouverture du serveur Web sur le port définit dans les variables d'environnement
app.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`))