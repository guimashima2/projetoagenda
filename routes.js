const express = require('express');
const route = express.Router();

const loginController = require('./src/controllers/loginController');
const produtoController = require('./src/controllers/produtoController.js');
const inventarioController = require('./src/controllers/inventarioController.js');
const cultivoController = require('./src/controllers/cultivoController.js');
const alertaController = require('./src/controllers/alertaController.js');

const { loginRequired } = require('./src/middlewares/middleware');

// Rotas de Login
route.get('/', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas de Usuario
route.get('/usuario/list', loginRequired, loginController.list);
route.get('/usuario/delete/:id', loginRequired, loginController.delete);

// Rotas de Produto
route.get('/produto/index', produtoController.index);
route.get('/produto/cadastrar', produtoController.cadastrar);
route.post('/produto/register', loginRequired, produtoController.register);
route.get('/produto/index/:id', loginRequired, produtoController.editIndex);
route.post('/produto/edit/:id', loginRequired, produtoController.edit);
route.get('/produto/delete/:id', loginRequired, produtoController.delete);

// Rotas de Inventario
route.get('/inventario/index', inventarioController.index);
route.get('/inventario/cadastrar', inventarioController.cadastrar);
route.post('/inventario/register', loginRequired, inventarioController.register);
route.get('/inventario/index/:id', loginRequired, inventarioController.editIndex);
route.post('/inventario/edit/:id', loginRequired, inventarioController.edit);
route.get('/inventario/delete/:id', loginRequired, inventarioController.delete);

// Rotas de Alerta
route.get('/alerta/index', alertaController.index);
route.get('/alerta/list', alertaController.list);
route.post('/alerta/register', loginRequired, alertaController.register);
route.get('/alerta/index/:id', loginRequired, alertaController.editIndex);
route.post('/alerta/edit/:id', loginRequired, alertaController.edit);
route.get('/alerta/delete/:id', loginRequired, alertaController.delete);

// Rotas de Cultivo
route.get('/cultivo/index', cultivoController.index);
route.get('/cultivo/cadastrar', cultivoController.cadastrar);
route.post('/cultivo/register', loginRequired, cultivoController.register);
route.get('/cultivo/index/:id', loginRequired, cultivoController.editIndex);
route.post('/cultivo/edit/:id', loginRequired, cultivoController.edit);
route.get('/cultivo/delete/:id', loginRequired, cultivoController.delete);

module.exports = route;
