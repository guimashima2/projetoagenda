const Alerta = require('../models/AlertaModel');

exports.index = (req, res) => {
  res.render('alerta', {
    alerta: {}
  });
};

exports.list = async (req, res) => {
    const alertas = await Alerta.buscaAlertas();
    res.render('alertaList', { alertas });
  };

exports.register = async(req, res) => {
  try {
    const alerta = new Alerta(req.body);
    await alerta.register();

    if(alerta.errors.length > 0) {
      req.flash('errors', alerta.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Alerta registrado com sucesso.');
    req.session.save(() => res.redirect(`/alerta/index/${alerta.alerta._id}`));
    return;
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const alerta = await Alerta.buscaPorId(req.params.id);
  if(!alerta) return res.render('404');

  res.render('alerta', { alerta });
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const alerta = new Alerta(req.body);
    await alerta.edit(req.params.id);

    if(alerta.errors.length > 0) {
      req.flash('errors', alerta.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Alerta editado com sucesso.');
    req.session.save(() => res.redirect(`/alerta/index/${alerta.alerta._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const alerta = await Alerta.delete(req.params.id);
  if(!alerta) return res.render('404');

  req.flash('success', 'Alerta apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};
