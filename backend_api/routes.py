from flask import jsonify, request
from models import Mercadoria, MovimentacoesEstoque, db
import utils
from sqlalchemy import func, case 
from datetime import datetime

def setup_routes(app):
    @app.route('/')
    def home():
        try:
            data_ok = Mercadoria.query.count() > 0
        except:
            data_ok = False
        if not data_ok:
            import init_test_db as initDb
            initDb.drop_create_data()
            return 'banco de dados criado, dados de teste inseridos'
        
        return 'supply chain - backend api -' + datetime.now().strftime('%Y-%m-%d %H:%M:%S')


    @app.route('/init_test_db')
    def init_test_db():
        import init_test_db as initDb
        initDb.drop_create_data()
        return 'init test db - ok'

    @app.route('/mercadorias/<int:id>', methods=['GET'])
    def mercadoria(id):
        mercadoria = Mercadoria.query.get(id)
        return jsonify(mercadoria.to_dict())

    @app.route('/mercadorias', methods=['GET', 'POST'])
    def mercadorias():
        if request.method == 'POST':
            # Lógica de adição
            data = request.get_json()
            if utils.validate_mercadoria_cadastro(data):
                nova_mercadoria = Mercadoria(nome=data['nome'], numero_registro=data['numero_registro'], 
                                             fabricante=data['fabricante'], tipo=data['tipo'], descricao=data['descricao'])
                db.session.add(nova_mercadoria)
                db.session.commit()
                return jsonify({'message': 'Mercadoria adicionada com sucesso'}), 201
            else:
                return jsonify({'message': 'Dados inválidos'}), 400

        else:  # GET
            mercadorias = Mercadoria.query.all()
            return jsonify([mercadoria.to_dict() for mercadoria in mercadorias])
        
    @app.route('/mercadorias/<int:id>', methods=['PUT', 'DELETE'])
    def update_delete_mercadoria(id):
        mercadoria = Mercadoria.query.get(id)
        if not mercadoria:
            return jsonify({'message': 'Mercadoria não encontrada'}), 404

        if request.method == 'PUT':
            data = request.get_json()
            if utils.validate_mercadoria_update(data, is_update=True):
                # Atualiza apenas os campos fornecidos
                if 'nome' in data:
                    mercadoria.nome = data['nome']
                if 'numero_registro' in data:
                    mercadoria.numero_registro = data['numero_registro']
                if 'fabricante' in data:
                    mercadoria.fabricante = data['fabricante']
                if 'tipo' in data:
                    mercadoria.tipo = data['tipo']
                if 'descricao' in data:
                    mercadoria.descricao = data['descricao']
                db.session.commit()
                return jsonify({'message': 'Mercadoria atualizada com sucesso'}), 200
            else:
                return jsonify({'message': 'Dados inválidos'}), 400

        elif request.method == 'DELETE':
            db.session.delete(mercadoria)
            db.session.commit()
            return jsonify({'message': 'Mercadoria excluída com sucesso'}), 200


    @app.route('/movimentacoes_estoque', methods=['POST'])
    def movimentacoes_estoque():
        # Lógica de adição para movimentações de estoque
        data = request.get_json()
        quantidade = data.get('quantidade')
        if quantidade is None or not isinstance(quantidade, int):
            return jsonify({'message': 'Quantidade inválida'}), 400
        
        nova_movimentacao = MovimentacoesEstoque(data_hora=data['data_hora'], mercadoria_id=data['mercadoria_id'],
                                                 quantidade=quantidade, local=data['local'])
        db.session.add(nova_movimentacao)
        db.session.commit()
        tipo_movimentacao = 'entrada' if quantidade > 0 else 'saída'
        return jsonify({'message': f'Movimentação de {tipo_movimentacao} registrada com sucesso'}), 201
    

    @app.route('/movimentacoes_estoque/resumo_mensal', methods=['GET'])
    def resumo_mensal_movimentacoes():
        # Realiza uma única consulta para obter entradas e saídas
        resumo = db.session.query(
            Mercadoria.nome.label('nome_produto'),
            func.sum(
                case(
                    (MovimentacoesEstoque.quantidade > 0, MovimentacoesEstoque.quantidade),
                    else_=0
                )
            ).label('entradas'),
            func.sum(
                case(
                    (MovimentacoesEstoque.quantidade < 0, -MovimentacoesEstoque.quantidade),
                    else_=0
                )
            ).label('saidas')
        ).join(Mercadoria, Mercadoria.id == MovimentacoesEstoque.mercadoria_id
        ).group_by(Mercadoria.nome).all()

        # Transforma o resultado em uma lista de dicionários
        resultado = [
            {
                'nome_produto': r.nome_produto,
                'entradas': r.entradas,
                'saidas': r.saidas
            } for r in resumo
        ]

        return jsonify(resultado)



    @app.route('/movimentacoes_estoque', methods=['GET'])
    def get_movimentacoes_estoque():
        movimentacoes = MovimentacoesEstoque.query.all()
        return jsonify([movimentacao.to_dict() for movimentacao in movimentacoes])

    @app.route('/movimentacoes_estoque/<int:id>', methods=['GET'])
    def movimentacao_estoque(id):
        movimentacao = MovimentacoesEstoque.query.get(id)
        return jsonify(movimentacao.to_dict())

    @app.route('/movimentacoes_estoque/saidas', methods=['GET'])
    def movimentacao_estoque_saidas():
        movimentacoes = MovimentacoesEstoque.query.filter(MovimentacoesEstoque.quantidade < 0)
        return jsonify([movimentacao.to_dict() for movimentacao in movimentacoes])

    @app.route('/movimentacoes_estoque/entradas', methods=['GET'])
    def movimentacao_estoque_entradas():
        movimentacoes = MovimentacoesEstoque.query.filter(MovimentacoesEstoque.quantidade > 0)
        return jsonify([movimentacao.to_dict() for movimentacao in movimentacoes])

    @app.route('/mercadorias/<int:id>/movimentacoes_estoque', methods=['GET'])
    def mercadoria_movimentacao_estoque(id):
        movimentacoes = MovimentacoesEstoque.query.filter(MovimentacoesEstoque.mercadoria_id == id)
        return jsonify([movimentacao.to_dict() for movimentacao in movimentacoes])

    @app.route('/mercadorias/<int:id>/saidas', methods=['GET'])
    def mercadoria_saidas(id):
        movimentacoes = MovimentacoesEstoque.query.filter(MovimentacoesEstoque.mercadoria_id == id, MovimentacoesEstoque.quantidade < 0)
        return jsonify([movimentacao.to_dict() for movimentacao in movimentacoes])

    @app.route('/mercadorias/<int:id>/entradas', methods=['GET'])
    def mercadoria_entradas(id):
        movimentacoes = MovimentacoesEstoque.query.filter(MovimentacoesEstoque.mercadoria_id == id, MovimentacoesEstoque.quantidade > 0)
        return jsonify([movimentacao.to_dict() for movimentacao in movimentacoes])