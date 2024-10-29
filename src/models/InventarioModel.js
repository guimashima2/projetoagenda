const mongoose = require('mongoose');
const validator = require('validator');

const InventarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const InventarioModel = mongoose.model('Inventario', InventarioSchema);

function Inventario(body) {
  this.body = body;
  this.errors = [];
  this.inventario = null;
}

Inventario.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.inventario = await InventarioModel.create(this.body);
};

Inventario.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.quantidade) this.errors.push('Quantidade é um campo obrigatório.');
};

Inventario.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    quantidade: this.body.quantidade
  };
};

Inventario.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.inventario = await InventarioModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Inventario.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const inventario = await InventarioModel.findById(id);
  return inventario;
};

Inventario.buscaInventarios = async function() {
  const inventarios = await InventarioModel.find()
    .sort({ criadoEm: -1 });
  return inventarios;
};

Inventario.delete = async function(id) {
  if(typeof id !== 'string') return;
  const inventario = await InventarioModel.findOneAndDelete({_id: id});
  return inventario;
};


module.exports = Inventario;
