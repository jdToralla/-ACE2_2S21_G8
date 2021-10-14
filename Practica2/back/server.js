require('dotenv').config()

const express = require('express')
const cors = require('cors');
// const SerialPort = require('serialport')
const ReadLine = require('@serialport/parser-readline')
const app = express()
app.use(cors())
const mongoose = require('mongoose')
const Subscriber = require('./models/arqui2p2')

//mongoose.connect("mongodb://sopes:sopes123@localhost:27017/subscribers", { useNewUrlParser: true })
//mongoose.connect("mongodb://192.168.1.8:27017/iotgl", { useNewUrlParser: true })

const mongoUserName = "DBuser";
const mongoPassword = "DBpassword";
//const mongoHost = "localhost";
const mongoHost = "34.212.26.108";
const mongoPort = "27017";
const mongoDatabase = "arqui2p2";



var uri = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase;


const options = {
    userNewUrlParser: true,
    userCreateIndex: true,
    userUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};
//const db = mongoose.connection
const db = mongoose.connect(uri, options).then(() => {
    console.log("\n");
    console.log("*******************************");
    console.log("✔ Mongo Successfully Connected!");
    console.log("*******************************");
    console.log("\n");
},
    (err) => {
        console.log("\n");
        console.log("*******************************");
        console.log("    Mongo Connection Failed    ");
        console.log("*******************************");
        console.log("\n");
        console.log(err);
    });

// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to Database'))

app.use(express.json({ limit: '50mb' }))

const subscribersRouter = require('./routes/arqui2pro1')
app.use('/arqui2p2', subscribersRouter)



const name_imput = "";
const chat_window = "";
const message_input = "";
//var content = name_input.nodeValue;



////CONEXION SERIAL PARA RECIBIR DATOS DE ARDUINO

// const port = new SerialPort('COM6', { baudRate: 9600 });
// const parser = port.pipe(new ReadLine({ delimiter: '\n' }));

// port.on("open", () => {
//     console.log("Puerto serial abierto");
// });

//parser.on( "data", async data => {
    
    //const received = JSON.parse(data);
    const received = JSON.parse('{"vviento":"N","dviento":"S","intensidad":100,"humedad":70,"temperatura":28, "lluvia":0 }');

 //   try {

        let subscriber = new Subscriber(received)
        var dt = new Date();
        dt.setHours(dt.getHours() - 6);
        //var dt2 = new Date();
        //dt2.setHours(dt2.getHours() - 6);
        subscriber.fecha = dt
        //subscriber.fecha_fin = dt2

        
            //console.log(data);
            subscriber.save()
                .then(subscriber => {
                    console.log(subscriber);
                    if (subscriber) {
                        console.log('registro creado exitosamente');
                    }
                })
                .catch(err => {
                    console.log("Error al crear");

                });
            if (subscriber.tipo == 4) {
                //const updatedSubscriber = await updateSubscriber(dt2)
                //console.log(updatedSubscriber)
                            }

        
    //} catch (err) {
    //    console.log("Error en la estructura");
    //    console.log(err);
    //}
//});




async function updateSubscriber(dt2) {
    let subscriber
    try {
      //var query = {$and:[{ estado: 0 }, { tipo: 1 }]};
      subscriber = await Subscriber.findOne({$and:[{ estado: 1 }, { tipo: 1 }]}).sort({"_id":-1}).limit(1)
      if (subscriber == null) {
        // return res.status(404).json({ message: 'Cannot find subscriber' })
        return "error"
      }
      else{
          console.log("correcto")
      }
    } catch (err) {
      return "error"
    }
    subscriber.estado=2;
    subscriber.fecha_fin = dt2
    subscriber.save();
    return subscriber
    
  }


// app.use(function (req, res, next) {
    
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cors ({
   origin: '*' 
    
}));

app.listen(5001, () => console.log('Server Started'))