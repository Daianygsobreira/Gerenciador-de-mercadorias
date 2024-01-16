def validate_mercadoria_cadastro(data):
    required_fields = ['nome', 'numero_registro', 'fabricante', 'tipo', 'descricao']

    # Verifica se todos os campos obrigatórios estão presentes
    for field in required_fields:
        if field not in data or not data[field]:
            return False

    # Verifica o comprimento dos campos string
    if len(data['nome']) > 255 or len(data['numero_registro']) > 255 or \
       len(data['fabricante']) > 255 or len(data['tipo']) > 255 or \
       len(data['descricao']) > 255:
        return False

    # Aqui você pode adicionar mais verificações conforme necessário
    # Por exemplo, validações de formato específico, valores numéricos, etc.

    return True

def validate_mercadoria_update(data, is_update=False):

    required_fields = ['nome', 'numero_registro', 'fabricante', 'tipo', 'descricao']

    # Se for uma atualização, os campos são opcionais
    if is_update:
        fields_to_check = data.keys()
    else:
        fields_to_check = required_fields

    # Verifica se os campos fornecidos (se for uma atualização) ou todos os campos obrigatórios (se for uma criação) estão presentes e não vazios
    for field in fields_to_check:
        if field in required_fields and (field not in data or not data[field]):
            return False

    # Verifica o comprimento dos campos string fornecidos
    for field in fields_to_check:
        if field in required_fields and len(data[field]) > 255:
            return False

    return True


