import React, { useState } from 'react';
import api from '../services/api';
import './styles.css'; // Ajuste o caminho conforme necessário



function MovimentacaoEstoqueForm() {
    const [movimentacao, setMovimentacao] = useState({
        data_hora: '',
        mercadoria_id: '',
        quantidade: 0,
        local: ''
    });
    const [tipoMovimentacao, setTipoMovimentacao] = useState("entrada"); // novo estado
    const [mensagem, setMensagem] = useState('');

    const handleChange = (e) => {
        if (e.target.name === "quantidade") {
            // Garante que a quantidade será positiva ou negativa baseada no tipo de movimentação
            const valorQuantidade = tipoMovimentacao === "saida" ? -Math.abs(e.target.value) : Math.abs(e.target.value);
            setMovimentacao({ ...movimentacao, quantidade: valorQuantidade });
        } else {
            setMovimentacao({ ...movimentacao, [e.target.name]: e.target.value });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const quantidadeFormatada = tipoMovimentacao === "saida" ? -Math.abs(movimentacao.quantidade) : Math.abs(movimentacao.quantidade);
        
        const dadosFormatados = {
            ...movimentacao,
            mercadoria_id: parseInt(movimentacao.mercadoria_id, 10),
            quantidade: quantidadeFormatada
        };

        try {
            const response = await api.post('/movimentacoes_estoque', dadosFormatados);
            console.log(response.data);

            setMovimentacao({ data_hora: '', mercadoria_id: '', quantidade: 0, local: '' });
            setMensagem('Movimentação registrada com sucesso!');
            setTimeout(() => setMensagem(''), 5000); // Limpa a mensagem após 5 segundos
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            setMensagem('Falha ao registrar movimentação.');
            setTimeout(() => setMensagem(''), 5000); // Limpa a mensagem após 5 segundos
        }
    };

    return (
        <div>
            {mensagem && <div>{mensagem}</div>}
            <div>
                <button onClick={() => setTipoMovimentacao("entrada")}>Entrada</button>
                <button onClick={() => setTipoMovimentacao("saida")}>Saída</button>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Data e Hora:</label>
                    <input
                        type="datetime-local"
                        name="data_hora"
                        value={movimentacao.data_hora}
                        onChange={handleChange}
                        required                />
                        </div>
            
                        <div>
                            <label>Mercadoria ID:</label>
                            <input
                                type="text"
                                name="mercadoria_id"
                                value={movimentacao.mercadoria_id}
                                onChange={handleChange}
                                required
                            />
                            {/* Aqui você pode substituir por um dropdown com as mercadorias */}
                        </div>
            
                        <div>
                            <label>Quantidade:</label>
                            <input
                                type="number"
                                name="quantidade"
                                value={movimentacao.quantidade}
                                onChange={handleChange}
                                required
                            />
                        </div>
            
                        <div>
                            <label>Local:</label>
                            <input
                                type="text"
                                name="local"
                                value={movimentacao.local}
                                onChange={handleChange}
                                required
                            />
                        </div>
            
                        <button type="submit">Registrar Movimentação</button>
                    </form>
                </div>
            );
        }

export default MovimentacaoEstoqueForm;
                    
