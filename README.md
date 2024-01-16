# MStarSupply: Sistema de Gerenciamento de Supply Chain

A MStarSupply, uma proeminente empresa de logística do Rio de Janeiro, enfrentava o desafio de manter seu controle de estoque atualizado devido à falta de um sistema centralizado.
A Morning Star foi encarregada de desenvolver um sistema online robusto que não só digitaliza o processo de cadastro de mercadorias, mas t
ambém permite o gerenciamento eficiente das entradas e saídas de produtos, fornecendo visualizações
gráficas do fluxo de estoque e a capacidade de exportar relatórios mensais.

# Funcionalidades

Gerenciamento de Mercadorias: Cadastro e edição de informações detalhadas de mercadorias.

Controle de Entrada e Saída: Registro preciso das movimentações de estoque, com validações para garantir a integridade dos dados.

Visualização Gráfica: Gráficos intuitivos mostrando as entradas e saídas mensais por mercadoria.

Exportação de Relatórios: Funcionalidade para gerar e baixar relatórios mensais em formato PDF.

# Tecnologias Utilizadas

Backend: Flask (Python) para criar uma API RESTful robusta e escalável.

Frontend: React.js para uma interface de usuário interativa e responsiva.

Database: MySQL para armazenamento e gestão eficiente de dados.

Contêineres: Docker para orquestração de serviços e ambiente consistente de desenvolvimento e produção.

# Desafios e Soluções

O Maior desafio, foi integrar diversas tecnologias. 
Apesar de algum conhecimento em java Script, Ainda nao havia trabalhado com React, um otimo aprendizado.

# Requerimentos
Docker

# Para Executar

Dentro da pasta raiz do repositório, execute o seguinte comando em um terminal:

docker compose --file docker-compose.yml up --detach --build

Após os containers estarem executando, acesse os seguintes endereços:

API Backend: http://localhost:5000 (para criar o banco de dados e os dados de teste)

Cliente Web: http://localhost:3000

MySQL do Projeto: mysql -uroot -proot -hlocalhost -P5001 -Dsupply_chain_db

Inicialização e Testes

Para recriar o banco de dados: http://localhost:5000/init_test_db

Acesse a API e o cliente web nos endereços fornecidos para testar todas as funcionalidades implementadas.


