const mongoose = require('mongoose');
const validator = require('validator');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true, default: '' },
  dataValidade: { type: Date, required: true, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ProdutoModel = mongoose.model('Produto', ProdutoSchema);

function Produto(body) {
  this.body = body;
  this.errors = [];
  this.produto = null;
}

Produto.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.produto = await ProdutoModel.create(this.body);
};

Produto.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.quantidade) this.errors.push('Quantidade é um campo obrigatório.');
  if(!this.body.dataValidade) this.errors.push('Data da Validade é um campo obrigatório.');
};

Produto.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    quantidade: this.body.quantidade,
    dataValidade: this.body.dataValidade,
  };
};

Produto.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.produto = await ProdutoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Produto.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const produto = await ProdutoModel.findById(id);
  return produto;
};

Produto.buscaProdutos = async function() {
  const produtos = await ProdutoModel.find()
    .sort({ criadoEm: -1 });
  return produtos;
};

Produto.delete = async function(id) {
  if(typeof id !== 'string') return;
  const produto = await ProdutoModel.findOneAndDelete({_id: id});
  return produto;
};


module.exports = Produto;
