const express = require("express")
const mongoose = require('mongoose')
const pug = require('pug')
const path = require('path')
const bodyparser = require('body-parser')
const app = express()
const http = require('http');
const multer = require('multer')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {};
const userstime = {};
app.use(express.static('img'))
app.use(bodyparser.urlencoded({ extended: true }));
var asdfg; let tag = 0;


//Setting up Multer
const upload = multer({ dest: 'img/uploads'})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img/uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + "Deepak-Suthar")
    }
})
const upload2 = multer({ storage: storage }).single('uploadimage')


//Code for Database
mongoose.connect("mongodb://localhost/PUG2", { useNewUrlParser: true });

const kittySchema = new mongoose.Schema({
    Time: String,
    name: String,
    email: String,
    password: String,
    uploadimage: String,
});
const Kitten = mongoose.model('Kitten', kittySchema);


//socket code goes from here
io.on('connection', (socket) => {
    socket.emit('sendingvalues', asdfg)
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        userstime[socket.id] = new Date() + 19800000;
        socket.broadcast.emit('user-joined', name, tag)
        for (key in users) {
            socket.broadcast.emit('erererer', users[key], userstime[key]);
            socket.emit('erererer', users[key], userstime[key]);
        }
        tag = 1;
    })
    socket.on('send', (message) => {
        socket.broadcast.emit('show-msz', data = { name: users[socket.id], info: message });
    })
    socket.on('Typestatus', (string) => {
        socket.broadcast.emit('sendingstatus', users[socket.id], string);
    })
    socket.on('disconnect', (name) => {
        socket.broadcast.emit('sendingstatus', users[socket.id], 'Welcome');
        socket.broadcast.emit('left-user', users[socket.id], tag);
        delete users[socket.id];
        for (key in users) {
            socket.broadcast.emit('erererer', users[key], userstime[key]);
            socket.emit('erererer', users[key], userstime[key]);
        }
    })
});



//view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.status(200).render('home.pug')
})
app.get('/hall', (req, res) => {
    res.status(200).render('form.pug')
})
app.get('/code', (req, res) => {
    res.status(200).render('code.pug')
})
app.get('/stopwatch', (req, res) => {
    res.status(200).render('stop.pug')
})
app.get('/calculator', (req, res) => {
    res.status(200).render('cal.pug')
})
app.get('/About', (req, res) => {
    res.status(200).render('About.pug')
})
app.post('/contact', upload2, (req, res) => {
    var myData = new Kitten({
        Time: new Date(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        uploadimage: req.file.filename,
    })
    var username123 = myData.name;
    myData.save().then(() => {
        asdfg = username123;
    
        res.status(200).render('hall.pug')
    }).catch(() => {
        res.status(400).send("item was not saved to the databse")
    })
})

server.listen(80, () => {
    console.log('listening at 80')
})

// taking data from database
// Kitten.find({},dbdata(err,udata));
// Kitten.find({_id?6239844679a7bdf857e1dc61},function(err,dbusers){
//     if(err) console.warn(err);
//     console.warn(dbusers);
// })
// function add(a,b){
//     return a+b;
// }
// console.log(add(3,4));
// module.exports.addition = add;
 

// "use strict";
// const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

  // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <deepaksuthar40128@gmail.com>', // sender address
//     to: "nehasuthar40128@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
