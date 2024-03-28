from flask import Flask, jsonify,redirect
from flask_cors import CORS
import mysql.connector
from db_config import configRemote, config


app = Flask(__name__)
CORS(app)


cnx = mysql.connector.connect(**config)
cursor = cnx.cursor(dictionary=True)

@app.route('/')
def index():
    return redirect('departamentos')

@app.route('/departamentos') #O tambien "/actas/ubigeo/Peru" pero cambiar el redirect linea 16 
def get_departamentos():
    cursor.callproc('sp_getDepartamentos', (1, 25))
    for data in cursor.stored_results():
        departamentos = data.fetchall()
    return departamentos

@app.route('/actas/ubigeo/') #O tambien "/continentes
def get_continentes():
    cursor.callproc('sp_getDepartamentos', (25, 30))
    for data in cursor.stored_results():
        continentes = data.fetchall()
    return continentes

@app.route('/provincias/<int:id_departamento>')
def get_provincias(id_departamento):
    cursor.callproc('sp_getProvincias', (id_departamento,))
    for data in cursor.stored_results():
        provincias = data.fetchall()
    return provincias

@app.route('/distritos/<int:id_provincia>')
def get_distritos(id_provincia):
    cursor.callproc('sp_getDistritos', (id_provincia,))
    for data in cursor.stored_results():
        distritos = data.fetchall()
    return distritos

@app.route('/locales_votacion/<int:id_distrito>')
def get_locales_votacion(id_distrito):
    cursor.callproc('sp_getLocalesVotacion', (id_distrito,))
    for data in cursor.stored_results():
        locales_votacion = data.fetchall()
    return locales_votacion 

@app.route('/grupo_votacion/<int:id_local_votacion>')
def get_grupo_votacion(id_local_votacion):
    cursor.callproc('sp_getGruposVotacion', (id_local_votacion,))
    for data in cursor.stored_results():
        grupo_votacion = data.fetchall()
    return grupo_votacion

@app.route('/votos')
def get_votos():
    cursor.callproc('sp_getVotos', (1, 25))
    for data in cursor.stored_results():
        votos = data.fetchall()
    return votos

@app.route('/actas/numero/<id_GrupoVotacion>')
def get_GrupoVotacion(id_GrupoVotacion):
    cursor.callproc('sp_getGrupoVotacion', (id_GrupoVotacion,))
    for data in cursor.stored_results():
        grupo_votacion = data.fetchone()
    return grupo_votacion

if __name__ == '__main__':
    app.run(debug=True)
