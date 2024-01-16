import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MercadoriaForm from './MercadoriaForm';
import EstoqueGrafico from './EstoqueGrafico';

function MercadoriasList() {
    const [mercadorias, setMercadorias] = useState([]);
    const [mercadoriaEditando, setMercadoriaEditando] = useState(null);
    const [mercadoriaGrafico, setMercadoriaGrafico] = useState(null);
    
    useEffect(() => {
        carregarMercadorias();
    }, []);
    
    const carregarMercadorias = () => {
        api.get('/mercadorias')
        .then(response => {
            setMercadorias(response.data); // Atualiza o estado com os dados recebidos
        })
        .catch(error => {
            console.error('Erro ao buscar mercadorias:', error);
            // Você pode lidar com erros aqui, talvez atualizando o estado com uma mensagem de erro
        });
    };
    
    const handleEdit = (mercadoria) => {
        setMercadoriaEditando(mercadoria);
    };
    const handleGrafico = (mercadoria) => {
        setMercadoriaGrafico(mercadoria);
    };
    const handleDelete = (id) => {
        api.delete(`/mercadorias/${id}`)
        .then(() => {
            console.log('Mercadoria deletada com sucesso');
            carregarMercadorias(); // Recarrega a lista para refletir a remoção
        })
        .catch(error => {
            console.error('Erro ao deletar mercadoria:', error);
        });
    };
    
    const handleCancel = () => {
        setMercadoriaEditando(null);
        setMercadoriaGrafico(null);
    };
    
    const handleSaveEdit = async () => {
        setMercadoriaEditando(null);
        carregarMercadorias();
    };

    if (mercadoriaEditando){
        return ( <MercadoriaForm mercadoria={mercadoriaEditando} onSave={handleSaveEdit} onCancel={handleCancel} /> );
    } else if (mercadoriaGrafico){
        return ( <EstoqueGrafico mercadoria={mercadoriaGrafico} onCancel={handleCancel} /> );
    }
    
    return (
        <div>
            <button onClick={() => setMercadoriaEditando({})}>Cadastrar Mercadoria</button>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Número de Registro</th>
                        <th>fabricante</th>
                        <th>tipo</th>
                        <th>descricao</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {mercadorias.map(mercadoria => (
                        <tr key={mercadoria.id}>
                            <td>{mercadoria.nome}</td>
                            <td>{mercadoria.numero_registro}</td>
                            <td>{mercadoria.fabricante}</td>
                            <td>{mercadoria.tipo}</td>
                            <td>{mercadoria.descricao}</td>
                            <td>
                                <button onClick={() => handleEdit(mercadoria)}>Editar</button>
                                <button onClick={() => handleGrafico(mercadoria)}>Estoque</button>
                                &nbsp;
                                <button onClick={() => handleDelete(mercadoria.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default MercadoriasList;
