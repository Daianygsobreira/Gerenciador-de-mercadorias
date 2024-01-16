from app import db
import models as M
from sqlalchemy import asc
from datetime import datetime


def drop_create_data():
    db.drop_all()
    db.create_all()
    print('banco de dados recriado')
    
    mercadorias_data = [
        {'nome': 'Mercadoria 01', 'numero_registro': 'NR9999_01', 'fabricante': 'Fabricante 1', 'tipo': 'Tipo 1', 'descricao': 'Descrição Mercadoria 01'},
        {'nome': 'Mercadoria 02', 'numero_registro': 'NR9999_02', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 2', 'descricao': 'Descrição Mercadoria 02'},
        {'nome': 'Mercadoria 03', 'numero_registro': 'NR9999_03', 'fabricante': 'Fabricante 3', 'tipo': 'Tipo 3', 'descricao': 'Descrição Mercadoria 03'},
        {'nome': 'Mercadoria 04', 'numero_registro': 'NR9999_04', 'fabricante': 'Fabricante 1', 'tipo': 'Tipo 4', 'descricao': 'Descrição Mercadoria 04'},
        {'nome': 'Mercadoria 05', 'numero_registro': 'NR9999_05', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 5', 'descricao': 'Descrição Mercadoria 05'},
        {'nome': 'Mercadoria 06', 'numero_registro': 'NR9999_06', 'fabricante': 'Fabricante 3', 'tipo': 'Tipo 1', 'descricao': 'Descrição Mercadoria 06'},
        {'nome': 'Mercadoria 07', 'numero_registro': 'NR9999_07', 'fabricante': 'Fabricante 1', 'tipo': 'Tipo 2', 'descricao': 'Descrição Mercadoria 07'},
        {'nome': 'Mercadoria 08', 'numero_registro': 'NR9999_08', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 3', 'descricao': 'Descrição Mercadoria 08'},
        {'nome': 'Mercadoria 09', 'numero_registro': 'NR9999_09', 'fabricante': 'Fabricante 3', 'tipo': 'Tipo 4', 'descricao': 'Descrição Mercadoria 09'},
        {'nome': 'Mercadoria 10', 'numero_registro': 'NR9999_10', 'fabricante': 'Fabricante 1', 'tipo': 'Tipo 5', 'descricao': 'Descrição Mercadoria 10'},
        {'nome': 'Mercadoria 11', 'numero_registro': 'NR9999_11', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 1', 'descricao': 'Descrição Mercadoria 11'},
        {'nome': 'Mercadoria 12', 'numero_registro': 'NR9999_12', 'fabricante': 'Fabricante 3', 'tipo': 'Tipo 2', 'descricao': 'Descrição Mercadoria 12'},
        {'nome': 'Mercadoria 13', 'numero_registro': 'NR9999_13', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 3', 'descricao': 'Descrição Mercadoria 13'},
        {'nome': 'Mercadoria 14', 'numero_registro': 'NR9999_14', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 4', 'descricao': 'Descrição Mercadoria 14'},
        {'nome': 'Mercadoria 15', 'numero_registro': 'NR9999_15', 'fabricante': 'Fabricante 2', 'tipo': 'Tipo 5', 'descricao': 'Descrição Mercadoria 15'},
    ]

    for data in mercadorias_data:
        mercadoria = M.Mercadoria(**data)
        db.session.add(mercadoria)

    db.session.commit()

    print('mercadorias adicionadas ao banco')

    for merc in M.Mercadoria.query.order_by(asc(M.Mercadoria.id)).all():
        for mes in range(1, 13):
            nReg = [1,3,4,9]
            nReg = nReg[(mes + merc.id) % len(nReg)]
            nQtd = [1,2,3,5,10,20,7,9,5,8]
            locals = ['Deposito A','Deposito B','Deposito C']
            for n in range(nReg):
                qtd = nQtd[(mes + merc.id + n) % len(nQtd)] + n
                qtd = qtd if n % 2 == 0 else qtd * -1
                dia = (mes * merc.id * n) % 28 + 1
                h = ((dia + abs(qtd)) * nReg ) % 13 + 8
                m = (dia * nReg) % 60
                d = datetime(2023, mes, dia, h, m, 0)

                movimentacao_data = {
                   'data_hora': d.strftime('%Y-%m-%d %H:%M:%S'),
                   'mercadoria_id': merc.id,
                   'quantidade': qtd,
                   'local': locals[int(d.timestamp()) % len(locals)]
                }
                db.session.add(M.MovimentacoesEstoque(**movimentacao_data))
    db.session.commit()

    print('movimentacoes adicionadas ao banco')