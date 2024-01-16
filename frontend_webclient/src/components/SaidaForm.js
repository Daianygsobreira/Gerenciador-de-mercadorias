import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles.css';

function SaidaForm() {
    const [movimentacao, setMovimentacao] = useState({
        mercadoria_id: 1,
        quantidade: 1,
        local: ''
    });
    const [mercadorias, setMercadorias] = useState([]);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        // Load mercadorias data when the component mounts
        carregarMercadorias();
    }, []);

    const carregarMercadorias = () => {
        api.get('/mercadorias')
            .then(response => {
                setMercadorias(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar mercadorias:', error);
            });
    };

    const handleChange = (e) => {
        setMovimentacao({ ...movimentacao, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = '/mercadorias/' + movimentacao.mercadoria_id + '/saidas'
            const response = await api.post(url, movimentacao);
            console.log(response.data);

            setMovimentacao({ data_hora: '', mercadoria_id: '', quantidade: 0, local: '' });
            setMensagem('Movimentação registrada com sucesso!');
            setTimeout(() => setMensagem(''), 5000);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            setMensagem('Falha ao registrar movimentação.');
            setTimeout(() => setMensagem(''), 5000);
        }
    };

    return (
        <div>
            {mensagem && <div>{mensagem}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mercadoria:</label>
                    <select
                        name="mercadoria_id"
                        value={movimentacao.mercadoria_id}
                        onChange={handleChange}
                        required
                    >
                        {mercadorias.map(mercadoria => (
                            <option key={mercadoria.id} value={mercadoria.id}>
                                {mercadoria.nome}
                            </option>
                        ))}
                    </select>
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
            
                <button type="submit">Registrar Saída</button>
            </form>
        </div>
    );
}

export default SaidaForm;
