from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Mercadoria(db.Model):
    __tablename__ = 'mercadorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    numero_registro = db.Column(db.String(255), nullable=False)
    fabricante = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(255), nullable=False)
    deletado = db.Column(db.Boolean, default=False, nullable=False)


    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'numero_registro': self.numero_registro,
            'fabricante': self.fabricante,
            'tipo': self.tipo,
            'descricao': self.descricao
        }

class MovimentacoesEstoque(db.Model):
    __tablename__ = 'movimentacoes_estoque'  # Adicione isso se a tabela se chama 'movimentacoes_estoque' no banco de dados
    id = db.Column(db.Integer, primary_key=True)
    data_hora = db.Column(db.DateTime(), nullable=False)
    mercadoria_id = db.Column(db.Integer, db.ForeignKey('mercadorias.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    local = db.Column(db.String(255), nullable=False)

    # Relacionamento (opcional)
    mercadoria = db.relationship('Mercadoria', backref=db.backref('movimentacoes', lazy=True))

    def to_dict(self):
       return {
            'id': self.id,
            'data_hora': self.data_hora.strftime("%Y-%m-%d %H:%M:%S"), # Formata a data e hora
            'mercadoria_id': self.mercadoria_id,
            'quantidade': self.quantidade,
            'local': self.local
        }