import React, { useState } from 'react';
import './styles.css'; // Ajuste o caminho conforme necessário
import api from '../services/api';
import MercadoriasList from '../components/MercadoriasList'; // Importe seu componente


function MercadoriaForm({ mercadoria, onSave, onCancel }) {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: mercadoria.nome || '',
    numero_registro: mercadoria.numeroRegistro || '',
    fabricante: mercadoria.fabricante || '',
    tipo: mercadoria.tipo || '',
    descricao: mercadoria.descricao || ''
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setDadosFormulario({ ...dadosFormulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post('/mercadorias', dadosFormulario);
      console.log(response.data);
      setMensagem('Mercadoria adicionada com sucesso!');
      setTimeout(() => setMensagem(''), 5000); // Limpa a mensagem após 5 segundos
      onSave(); // Chame onSave para informar ao componente pai que a operação foi concluída
    } catch (error) {
      console.error('Ocorreu um erro ao enviar os dados:', error);
      setMensagem('Falha ao adicionar mercadoria.');
      setTimeout(() => setMensagem(''), 5000); // Limpa a mensagem após 5 segundos
    }
  };
  
  return (
    <div>
      {mensagem && <div>{mensagem}</div>}
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              name="nome"
              value={dadosFormulario.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Número de Registro:</label>
            <input
              type="text"
              name="numero_registro"
              value={mercadoria.numero_registro}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Fabricante:</label>
            <input
              type="text"
              name="fabricante"
              value={mercadoria.fabricante}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Tipo:</label>
            <input
              type="text"
              name="tipo"
              value={mercadoria.tipo}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Descrição:</label>
            <textarea
              name="descricao"
              value={mercadoria.descricao}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Cadastrar Mercadoria</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancelar</button>
           
        </form>
    </div>
  );
}

export default MercadoriaForm;
