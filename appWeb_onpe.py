from flask import Flask, render_template, redirect, request
import mysql.connector
from db_config import configRemote, config

#Cambiar a config si la base remota empieza a fallar
cnx = mysql.connector.connect(**config)
cursor = cnx.cursor(dictionary=True)
app = Flask(__name__)


@app.route('/')
def on():
    return redirect('/index')

@app.route('/index')
def index():
    return render_template('selector.html')

@app.route('/actas_ubigeo')
def actas_ubigeo():
    return render_template('actas_ubigeo.html')

#Actas Numero:
@app.route('/actas_numero')
def actas_numero():
    return render_template('actas_numero.html')

@app.route('/actas/numero/<id_GrupoVotacion>', methods=['GET'])
def get_GrupoVotacion(id_GrupoVotacion):
    cursor.callproc('sp_getGrupoVotacion', (id_GrupoVotacion,))
    for data in cursor.stored_results():
        grupo_votacion = data.fetchone()
    return grupo_votacion


@app.route('/participacion')
def participacion():
    return render_template('participacion.html')

@app.route('/participacion_total')
def participacion_total():
    return render_template('participacion_total.html')

if __name__== '__main__':
    app.run(debug=True)