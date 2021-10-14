const express = require('express')
const router = express.Router()
const Subscriber = require('../models/arqui2p2')


//{fecha: { $gte: new Date(2021, 5, 14), $lt: new Date(2021, 7, 30) }}).sort({fecha:-1}
// Getting all
router.get('/', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const subscribers = await Subscriber.find().sort({"_id":-1});
    res.json(subscribers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting all
router.post('/fecha', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const añod = req.body.añodesde
    const mesd = req.body.mesdesde
    const diad =req.body.diadesde
    const añoh = req.body.añohasta
    const mesh = req.body.meshasta
    const diah =req.body.diahasta
    
    const subscribers = await Subscriber.find({fecha_inicio: { $gte: new Date(añod, mesd, diad), $lt: new Date(añoh, mesh, diah) }}).sort({fecha_inicio:-1})
    res.json(subscribers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getSubscriber, (req, res) => {
  res.json(res.subscriber)
})

router.post('/last', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const subscribers = await Subscriber.findOne({ tipo: 1 }).sort({"_id":-1}).limit(1)

    if(subscribers.estado==2){
      subscribers.valor=0;
      subscribers.estado=0;
    }
    else
      subscribers.estado=1;

    res.json({"inicio":subscribers.fecha_inicio, "fin":subscribers.fecha_fin, "peso":subscribers.valor, "sentado": subscribers.estado})
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




// Creating one
router.post('/', async (req, res) => {
  const subscriber = new Subscriber({
<<<<<<< HEAD
    vviento:req.body.vviento,
    dviento: req.body.dviento,
    intensidad: req.body.intensidad,
    humedad: req.body.humedad,
    temperatura: req.body.temperatura,
    lluvia: req.body.lluvia
  })
  //var diasadd = req.body.dias

  var dt = new Date();
  dt.setHours( dt.getHours() - 6 );
  //dt.setDate(dt.getDate() + diasadd);
  
  subscriber.fecha = dt   
  
=======
    tipo:req.body.tipo,
    valor: req.body.valor
  })
  var diasadd = req.body.dias

  var dt = new Date();
  dt.setHours( dt.getHours() - 6 );
  dt.setDate(dt.getDate() + diasadd);
  var dt2 = new Date();
  dt2.setHours( dt2.getHours() - 6 );
  dt2.setDate(dt2.getDate() + diasadd);
  
  subscriber.fecha_inicio = dt   
  subscriber.fecha_fin = dt2
  subscriber.estado = 0
>>>>>>> 4e1d318c946796309272685ed3eebf82c16c6b24

  try {
    const newSubscriber = await subscriber.save()
    res.status(200).json(newSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

<<<<<<< HEAD
// // Creating one
// router.post('/', async (req, res) => {
//   const subscriber = new Subscriber({
//     tipo:req.body.tipo,
//     valor: req.body.valor
//   })
//   var diasadd = req.body.dias

//   var dt = new Date();
//   dt.setHours( dt.getHours() - 6 );
//   dt.setDate(dt.getDate() + diasadd);
//   var dt2 = new Date();
//   dt2.setHours( dt2.getHours() - 6 );
//   dt2.setDate(dt2.getDate() + diasadd);
  
//   subscriber.fecha_inicio = dt   
//   subscriber.fecha_fin = dt2
//   subscriber.estado = 0

//   try {
//     const newSubscriber = await subscriber.save()
//     res.status(200).json(newSubscriber)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

=======
>>>>>>> 4e1d318c946796309272685ed3eebf82c16c6b24
// Updating One
router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.location != null) {
    res.subscriber.location = req.body.location
  }
  try {
    const updatedSubscriber = await res.subscriber.save()
    res.json(updatedSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove()
    res.json({ message: 'Deleted Subscriber' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.subscriber = subscriber
  next()
}

router.post('/currentDate', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  try {
    const date = req.body.date
    const subscribers = await Subscriber.find({ fecha_inicio: { $gte:`${date}T00:00:00.000Z`,$lt: `${date}T23:59:59.999Z`} }).sort({ fecha_fin: -1 })
    res.json(subscribers)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router