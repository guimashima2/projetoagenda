const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if(req.session.user) return res.render('login-logado');
  return res.render('login');
};

exports.list = async (req, res) => {
  const login = new Login()
  const usuarios =  await login.buscaUsuarios()
  res.render('usuarioList', { usuarios });
};

exports.delete = async function(req, res) {
  const login = new Login()
  if(!req.params.id) return res.render('404');

  const usuario = await login.delete(req.params.id);
  if(!usuario) return res.render('404');

  req.flash('success', 'Usuario apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};

exports.register = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function() {
        return res.redirect('back');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function() {
      return res.redirect('back');
    });
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.login = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function() {
        return res.redirect('back');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    req.session.save(function() {
      return res.redirect('back');
    });
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

