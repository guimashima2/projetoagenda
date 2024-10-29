const Cultivo = require('../models/CultivoModel');

exports.index = async(req, res) => {
    const cultivos = await Cultivo.buscaCultivos();
    res.render('cultivoList', { cultivos });
  };

exports.cadastrar = (req, res) => {
    res.render('cultivo', {
      cultivo: {}
    });
  };

exports.register = async(req, res) => {
  try {
    const cultivo = new Cultivo(req.body);
    await cultivo.register();

    if(cultivo.errors.length > 0) {
      req.flash('errors', cultivo.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Cultivo registrado com sucesso.');
    req.session.save(() => res.redirect(`/cultivo/index/${cultivo.cultivo._id}`));
    return;
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const cultivo = await Cultivo.buscaPorId(req.params.id);
  if(!cultivo) return res.render('404');

  res.render('cultivo', { cultivo });
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const cultivo = new Cultivo(req.body);
    await cultivo.edit(req.params.id);

    if(cultivo.errors.length > 0) {
      req.flash('errors', cultivo.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Cultivo editado com sucesso.');
    req.session.save(() => res.redirect(`/cultivo/index/${cultivo.cultivo._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const cultivo = await Cultivo.delete(req.params.id);
  if(!cultivo) return res.render('404');

  req.flash('success', 'Cultivo apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};
