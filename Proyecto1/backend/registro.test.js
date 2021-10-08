const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { eliminarUsuario } = require('../controllers/registro.controller');

var usuario;

beforeAll(async () => {
    const mongoose = require('mongoose');
    const host = 'cluster0.1ojwk.mongodb.net';
    const username = '2learn';
    const password = 'Nq5La6e3KZhZ8jTO';
    const database = 'tests';
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    await mongoose.connect(`mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`);

});

describe("Pruebas de registro de usuario", () => {
    it("Se prueba que la respuesta tenga la propiedad mensaje", async done => {
        var res = await request.post("/registro");

        expect(res.body).toHaveProperty('errors');
        done();
    });

    it("Se prueba que se envio un objeto vacio", async done => {
        var res = await request.post("/registro");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que se enviaron campos vacios", async done => {
        var res = await request.post("/registro")
            .field("correo", "")
            .field("password", "")
            .field("nombre", "")
            .field("apellido", "")
            .field("username", "");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                case "username":
                    expect(errors[i].msg).toEqual('El nombre de usuario es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que no se envio correo electronico", async done => {
        var res = await request.post("/registro")
            .field("correo", "")
            .field("password", "abcd1234")
            .field("nombre", "Usuario")
            .field("apellido", "De Prueba")
            .field("username", "testut");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que no se envio password", async done => {
        var res = await request.post("/registro")
            .field("correo", "prueba@gmail.com")
            .field("password", "")
            .field("nombre", "Usuario")
            .field("apellido", "De Prueba")
            .field("username", "testut");
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que no se envio nombre", async done => {
        var res = await request.post("/registro")
            .field("correo", "prueba@gmail.com")
            .field("password", "abcd1234")
            .field("nombre", "")
            .field("apellido", "De Prueba")
            .field("username", "testut");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que no se envio apellido", async done => {
        var res = await request.post("/registro")
            .field("correo", "prueba@gmail.com")
            .field("password", "abcd1234")
            .field("nombre", "Usuario")
            .field("apellido", "")
            .field("username", "testut");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que no se envio username", async done => {
        var res = await request.post("/registro")
            .field("correo", "prueba@gmail.com")
            .field("password", "abcd1234")
            .field("nombre", "Usuario")
            .field("apellido", "Pruebas")
            .field("username", "");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El nombre de usuario es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });

    it("Se valida que se registro correctamente el usuario", async done => {
        var res = await request.post("/registro")
            .field("correo", "pruebas@gmail.com")
            .field("password", "abcd1234")
            .field("nombre", "Usuario")
            .field("apellido", "De Prueba")
            .field("username", "testut");
        usuario = res.body._id;

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('mensaje');
        expect(res.body.mensaje).toEqual('Usuario registrado correctamente');

        done();
    });

    it("Se valida que el correo ya fue registrado", async done => {
        var res = await request.post("/registro")
            .field("correo", "prueba@gmail.com")
            .field("password", "abcd1234")
            .field("nombre", "Usuario")
            .field("apellido", "De Prueba")
            .field("username", "testut");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('mensaje');
        expect(res.body.mensaje).toEqual('El correo electronico ya fue registrado');

        done();
    });

    it("Se valida si el formato de correo es invalido", async done => {
        var res = await request.post("/registro")
            .field("correo", "pruebagmail.com")
            .field("password", "abcd1234")
            .field("nombre", "Usuario")
            .field("apellido", "De Prueba")
            .field("username", "testut");

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        const { errors } = res.body;
        const noErrors = res.body.errors.length;
        for (var i = 0; i < noErrors; i++) {

            switch (errors[i].param) {
                case "correo":
                    expect(['El correo electronico es obligatorio', 'El formato de correo electronico no es valido']).toContain(errors[i].msg);
                    break;
                case "password":
                    expect(errors[i].msg).toEqual('La contraseña es obligatoria');
                    break;
                case "nombre":
                    expect(errors[i].msg).toEqual('El nombre es obligatorio');
                    break;
                case "apellido":
                    expect(errors[i].msg).toEqual('El apellido es obligatorio');
                    break;
                default:
                    break;
            }
        }

        done();
    });
});

afterAll(async () => {
    await eliminarUsuario(usuario);
});