import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils/utils.js';
import productsRoutes from "./routes/productsRouter.js"
import cartsRoutes from "./routes/cartsRouter.js"
import viewsRoutes from "./routes/viewsRouter.js"
import messagesRouter from  "./routes/messagesRouter.js"
import { Server } from 'socket.io';
import { productsUpdated, chat  } from './utils/socketUtils.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRoutes);

const mongoURL = 'mongodb+srv://admin:admin@clusterprueba.g12vkb7.mongodb.net/ecommerce'

mongoose.connect(mongoURL)
    .then(() => {
        console.log("MongoDB conectado correctamente");
    })
    .catch(err => {
        console.log("Imposible conectar con MongoDB");
    });

const port = 8080;
const serverHttp = app.listen(port, () => {console.log('Servidor iniciado')})

const io = new Server(serverHttp);

app.set('io', io);

io.on('connection', socket => {
    console.log('New client connected', socket.id);
    productsUpdated(io);
    chat(socket, io);
});