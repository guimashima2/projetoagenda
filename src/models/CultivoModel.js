const mongoose = require('mongoose');
const validator = require('validator');

const CultivoSchema = new mongoose.Schema({
  temperatura: { type: Number, required: true },
  umidade: { type: Number, required: true, default: '' },
  nivelNutrientes: { type: Number, required: true, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const CultivoModel = mongoose.model('Cultivo', CultivoSchema);

function Cultivo(body) {
  this.body = body;
  this.errors = [];
  this.cultivo = null;
}

Cultivo.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.cultivo = await CultivoModel.create(this.body);
};

Cultivo.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(!this.body.temperatura) this.errors.push('Temperatura é um campo obrigatório.');
  if(!this.body.umidade) this.errors.push('Umidade é um campo obrigatório.');
  if(!this.body.nivelNutrientes) this.errors.push('Nivel do Nutriente é um campo obrigatório.');
};

Cultivo.prototype.cleanUp = function() {
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

Cultivo.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.cultivo = await CultivoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Cultivo.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const cultivo = await CultivoModel.findById(id);
  return cultivo;
};

Cultivo.buscaCultivos = async function() {
  const cultivos = await CultivoModel.find()
    .sort({ criadoEm: -1 });
  return cultivos;
};

Cultivo.delete = async function(id) {
  if(typeof id !== 'string') return;
  const cultivo = await CultivoModel.findOneAndDelete({_id: id});
  return cultivo;
};


module.exports = Cultivo;
