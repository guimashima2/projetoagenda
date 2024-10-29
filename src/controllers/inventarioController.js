const Inventario = require('../models/InventarioModel');

exports.index = async(req, res) => {
    const inventarios = await Inventario.buscaInventarios();
    res.render('inventarioList', { inventarios });
  };

exports.cadastrar = (req, res) => {
    res.render('inventario', {
      inventario: {}
    });
  };

exports.register = async(req, res) => {
  try {
    const inventario = new Inventario(req.body);
    await inventario.register();

    if(inventario.errors.length > 0) {
      req.flash('errors', inventario.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Inventario registrado com sucesso.');
    req.session.save(() => res.redirect(`/inventario/index/${inventario.inventario._id}`));
    return;
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const inventario = await Inventario.buscaPorId(req.params.id);
  if(!inventario) return res.render('404');

  res.render('inventario', { inventario });
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const inventario = new Inventario(req.body);
    await inventario.edit(req.params.id);

    if(inventario.errors.length > 0) {
      req.flash('errors', inventario.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Inventario editado com sucesso.');
    req.session.save(() => res.redirect(`/inventario/index/${inventario.inventario._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const inventario = await Inventario.delete(req.params.id);
  if(!inventario) return res.render('404');

  req.flash('success', 'Inventario apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};
