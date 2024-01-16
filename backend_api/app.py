from flask import Flask
from models import db
from flask_cors import CORS
import routes

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@supplychain.db:3306/supply_chain_db'

db.init_app(app)

routes.setup_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
