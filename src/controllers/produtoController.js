const Produto = require('../models/ProdutoModel');

exports.index = async(req, res) => {
    const produtos = await Produto.buscaProdutos();
    res.render('produtoList', { produtos });
  };

exports.cadastrar = (req, res) => {
    res.render('produto', {
      produto: {}
    });
  };

exports.register = async(req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.register();

    if(produto.errors.length > 0) {
      req.flash('errors', produto.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Produto registrado com sucesso.');
    req.session.save(() => res.redirect(`/produto/index/${produto.produto._id}`));
    return;
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const produto = await Produto.buscaPorId(req.params.id);
  if(!produto) return res.render('404');

  res.render('produto', { produto });
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const produto = new Produto(req.body);
    await produto.edit(req.params.id);

    if(produto.errors.length > 0) {
      req.flash('errors', produto.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Produto editado com sucesso.');
    req.session.save(() => res.redirect(`/produto/index/${produto.produto._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const produto = await Produto.delete(req.params.id);
  if(!produto) return res.render('404');

  req.flash('success', 'Produto apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};
