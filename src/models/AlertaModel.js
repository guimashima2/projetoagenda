const { text } = require('express');
const mongoose = require('mongoose');
const validator = require('validator');

const AlertaSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  mensagem: { type: String, required: true, default: '' },
  date: { type: Date, required: true, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const AlertaModel = mongoose.model('Alerta', AlertaSchema);

function Alerta(body) {
  this.body = body;
  this.errors = [];
  this.alerta = null;
}

Alerta.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.alerta = await AlertaModel.create(this.body);
};

Alerta.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(!this.body.temperatura) this.errors.push('Temperatura é um campo obrigatório.');
  if(!this.body.umidade) this.errors.push('Umidade é um campo obrigatório.');
  if(!this.body.nivelNutrientes) this.errors.push('Nivel do Nutriente é um campo obrigatório.');
};

Alerta.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    temperatura: this.body.temperatura,
    umidade: this.body.umidade,
    nivelNutrientes: this.body.nivelNutrientes,
  };
};

Alerta.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.alerta = await AlertaModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Alerta.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const alerta = await AlertaModel.findById(id);
  return alerta;
};

Alerta.buscaAlertas = async function() {
  const alertas = await AlertaModel.find()
    .sort({ criadoEm: -1 });
  return alertas;
};

Alerta.delete = async function(id) {
  if(typeof id !== 'string') return;
  const alerta = await AlertaModel.findOneAndDelete({_id: id});
  return alerta;
};


module.exports = Alerta;
