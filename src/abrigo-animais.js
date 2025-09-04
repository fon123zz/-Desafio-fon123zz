class AbrigoAnimais {

  constructor() {
    this.animais = [
      { nome: 'Rex', tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      { nome: 'Mimi', tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      { nome: 'Fofo', tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      { nome: 'Zero', tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      { nome: 'Bola', tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      { nome: 'Bebe', tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      { nome: 'Loco', tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    ];

    this.brinquedosValidos = ['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'];
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const pessoas = {
      'pessoa 1': { id: 1, brinquedos: this.parseBrinquedos(brinquedosPessoa1), animaisAdotados: 0 },
      'pessoa 2': { id: 2, brinquedos: this.parseBrinquedos(brinquedosPessoa2), animaisAdotados: 0 }
    };

    const animaisParaConsiderar = ordemAnimais.split(',').map(a => a.trim());

    const erroValidacao = this.validarEntradas(pessoas, animaisParaConsiderar);
    if (erroValidacao) {
      return erroValidacao;
    }

    const resultados = {};

    for (const animalNome of animaisParaConsiderar) {
      const animal = this.animais.find(a => a.nome === animalNome);
      
      const pessoa1Apta = this.isApta(pessoas['pessoa 1'], animal, resultados);
      const pessoa2Apta = this.isApta(pessoas['pessoa 2'], animal, resultados);

      if (pessoa1Apta && pessoa2Apta) {
        resultados[animal.nome] = `${animal.nome} - abrigo`;
      } else if (pessoa1Apta) {
        resultados[animal.nome] = `${animal.nome} - pessoa 1`;
        pessoas['pessoa 1'].animaisAdotados++;
      } else if (pessoa2Apta) {
        resultados[animal.nome] = `${animal.nome} - pessoa 2`;
        pessoas['pessoa 2'].animaisAdotados++;
      } else {
        resultados[animal.nome] = `${animal.nome} - abrigo`;
      }
    }

    const listaOrdenada = Object.keys(resultados).sort().map(key => resultados[key]);
    return { lista: listaOrdenada };
  }

  parseBrinquedos(brinquedosStr) {
    if (!brinquedosStr) return [];
    return brinquedosStr.split(',').map(b => b.trim().toUpperCase());
  }

  validarEntradas(pessoas, animaisParaConsiderar) {
    const nomesAnimaisExistentes = this.animais.map(a => a.nome);
    const animaisVistos = new Set();
    for (const nome of animaisParaConsiderar) {
      if (!nomesAnimaisExistentes.includes(nome) || animaisVistos.has(nome)) {
        return { erro: 'Animal inválido' };
      }
      animaisVistos.add(nome);
    }

    for (const p of Object.values(pessoas)) {
        const brinquedosVistos = new Set();
        for (const b of p.brinquedos) {
            if (!this.brinquedosValidos.includes(b) || brinquedosVistos.has(b)) {
                return { erro: 'Brinquedo inválido' };
            }
            brinquedosVistos.add(b);
        }
    }

    return null;
  }

  isApta(pessoa, animal, resultados) {
    if (pessoa.animaisAdotados >= 3) {
      return false;
    }

    if (animal.nome === 'Loco') {
      const temCompanhia = Object.values(resultados).some(r => r.includes('pessoa'));
      const temBrinquedos = animal.brinquedos.every(b => pessoa.brinquedos.includes(b));
      return temCompanhia && temBrinquedos;
    }

    if (animal.tipo === 'gato') {
        if(JSON.stringify(pessoa.brinquedos) === JSON.stringify(animal.brinquedos)){
            return true;
        }
    }

    let animalToyIndex = 0;
    for (const toy of pessoa.brinquedos) {
      if (animalToyIndex < animal.brinquedos.length && toy === animal.brinquedos[animalToyIndex]) {
        animalToyIndex++;
      }
    }
    return animalToyIndex === animal.brinquedos.length;
  }
}

export { AbrigoAnimais };

