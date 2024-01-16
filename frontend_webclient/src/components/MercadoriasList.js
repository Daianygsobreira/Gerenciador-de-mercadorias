import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MercadoriaForm from './MercadoriaForm';

function MercadoriasList() {
  const [mercadorias, setMercadorias] = useState([]);
  const [mercadoriaEditando, setMercadoriaEditando] = useState(null);

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
  

  const handleSaveEdit = async (mercadoriaAtualizada) => {
    try {
        const response = await api.put(`/mercadorias/${mercadoriaAtualizada.id}`, mercadoriaAtualizada);
        console.log(response.data);
        setMercadoriaEditando(null);
        carregarMercadorias(); // Recarrega a lista de mercadorias
    } catch (error) {
        console.error('Erro ao atualizar mercadoria:', error);
    }
};


  return (
      <div>
          {mercadoriaEditando ? (
                <MercadoriaForm mercadoria={mercadoriaEditando} onSave={handleSaveEdit} onCancel={() => setMercadoriaEditando(null)} />
                ) : (
                    <>
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
                                            <button onClick={() => handleDelete(mercadoria.id)}>Deletar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        );
    }
export default MercadoriasList;
