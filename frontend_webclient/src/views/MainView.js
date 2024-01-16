import React, { useState } from 'react';
import MercadoriaForm from '../components/MercadoriaForm';
import MovimentacaoEstoqueForm from '../components/MovimentacaoEstoqueForm';
import EstoqueGrafico from '../components/EstoqueGrafico';
import MercadoriasList from '../components/MercadoriasList'; // Importe seu componente

function MainView() {
    const [activeTab, setActiveTab] = useState('listaMercadorias');

    const buttonStyle = {
        margin: '0 10px 20px 0', // Adiciona margem à direita e abaixo dos botões
        padding: '10px',          // Adiciona um pouco de preenchimento interno para os botões
    };

    return (
        <div>
            <button style={buttonStyle} onClick={() => setActiveTab('listaMercadorias')}>
                Gerenciamento de Mercado
            </button>
            <button style={buttonStyle} onClick={() => setActiveTab('movimentacao')}>
                Movimentação de Estoque
            </button>
            <button style={buttonStyle} onClick={() => setActiveTab('Estoque')}>
                Gráfico de Estoque
            </button>
            
            {activeTab === 'movimentacao' && <MovimentacaoEstoqueForm />}
            {activeTab === 'Estoque' && <EstoqueGrafico />}
            {activeTab === 'listaMercadorias' && <MercadoriasList />}
        </div>
    );
}

export default MainView;
