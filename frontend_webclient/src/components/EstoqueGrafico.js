import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);



function EstoqueGrafico() {
    const [dadosGrafico, setDadosGrafico] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
    api.get('/movimentacoes_estoque/resumo_mensal')
        .then(resposta => {
            const dados = resposta.data;
            const labels = dados.map(d => d.nome_produto);
            const entradas = dados.map(d => d.entradas);
            const saidas = dados.map(d => d.saidas);
            
            setDadosGrafico({
                labels: labels,
                datasets: [
                    {
                        label: 'Entradas',
                        data: entradas,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    },
                    {
                        label: 'Saídas',
                        data: saidas,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    }
                ],
            });
        })
.catch(error => {
console.error('Erro ao buscar dados:', error);
});
}, []);

const exportarDadosPDF = () => {
    // Cria uma nova instância de jsPDF
    const pdf = new jsPDF();

    // Define as colunas e os dados da tabela
    const colunas = ['Produto', 'Entradas', 'Saídas'];
    const dados = dadosGrafico.labels.map((label, index) => [
        label,
        dadosGrafico.datasets[0].data[index], // entradas
        dadosGrafico.datasets[1].data[index], // saídas
    ]);

    // Adiciona a tabela ao documento
    autoTable(pdf, {
        head: [colunas],
        body: dados,
    });

    // Salva o PDF
    pdf.save('dados_estoque.pdf');
};

const options = {
    responsive: true,
    plugins: {
        datalabels: {
            color: '#000000',
            anchor: 'end',
            align: 'top',
            formatter: (value, context) => {
                return value; 
            }
        }
    },
    scales: {
        x: { stacked: false },
        y: { stacked: false }
    }
};
return (
    <div style={{ width: '50%', margin: 'auto', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '20px' }}>
            <button onClick={exportarDadosPDF} style={{ padding: '10px', marginRight: '10px' }}>Exportar Dados para PDF</button>
        </div>
        <div style={{ marginBottom: '20px' }}>
            {dadosGrafico.labels.length > 0 && dadosGrafico.datasets.length > 1 ? (
                <Bar data={dadosGrafico} options={options} />
            ) : (
                <div>Não há dados para exibir.</div>
            )}
        </div>
        {dadosGrafico.labels.length > 0 && dadosGrafico.datasets.length > 1 && (
            <div>
                <h3 style={{ textAlign: 'left', marginBottom: '10px' }}>Estoque dos Produtos</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Produto</th>
                                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Entradas</th>
                                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Saídas</th>
                                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Estoque Atual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosGrafico.datasets[0].data.map((entrada, index) => {
                                const produto = dadosGrafico.labels[index];
                                const saida = dadosGrafico.datasets[1].data[index];
                                const estoque = entrada - saida;
                                return (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{produto}</td>
                                        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{entrada}</td>
                                        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{saida}</td>
                                        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{estoque}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);



 };
export default EstoqueGrafico;