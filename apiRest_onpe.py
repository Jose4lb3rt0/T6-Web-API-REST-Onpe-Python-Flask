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
    return redirect('/departamentos/Peru')

#1. sp_getDepartamentos
@app.route('/departamentos/Peru')
def get_departamentos():
    cursor.callproc('sp_getDepartamentos', (1, 25))
    for data in cursor.stored_results():
        departamentos = data.fetchall()
    return departamentos
#2. sp_getDepartamentos
@app.route('/departamentos/Extranjero')
def get_continentes():
    cursor.callproc('sp_getDepartamentos', (26, 30))
    for data in cursor.stored_results():
        continentes = data.fetchall()
    return continentes
#3. sp_getDistritos
@app.route('/distritos/<int:id>')
def get_distritos(id):
    cursor.callproc('sp_getDistritos', (id,))
    for data in cursor.stored_results():
        distritos = data.fetchall()
    return distritos
#3. sp_getDistritosByProvincia
@app.route('/distritos_provincia/<provincia>')
def get_distritosByProvincia(provincia):
    cursor.callproc('sp_getDistritosByProvincia', (provincia,))
    for data in cursor.stored_results():
        distritos_provincia = data.fetchall()
    return distritos_provincia
#4. sp_getDistritosDepartamento
@app.route('/distritos_departamento/<departamento>')
def get_distritosDepartamento(departamento):
    cursor.callproc('sp_getDistritosDepartamento', (departamento,))
    for data in cursor.stored_results():
        distritos = data.fetchall()
    return distritos
#5. sp_getGruposVotacion
@app.route('/grupos_votacion/<id_grupovotacion>')
def get_gruposVotacion(id_grupovotacion):
    cursor.callproc('sp_getGruposVotacion', (id_grupovotacion,))
    for data in cursor.stored_results():
        grupos_votacion = data.fetchall()
    return grupos_votacion
#6. sp_getGruposVotacionByProvinciaDistritoLocal
@app.route('/<provincia>/<distrito>/<local>')
def get_provinciaDistritoLocal(provincia,distrito,local):
    cursor.callproc('sp_getGruposVotacionByProvinciaDistritoLocal', (provincia,distrito,local,))
    for data in cursor.stored_results():
        grupos_votacion = data.fetchall()
    return grupos_votacion
#7. sp_getGrupoVotacion
@app.route('/grupo_votacion/<id_grupovotacion>')
def get_grupoVotacion(id_grupovotacion):
    cursor.callproc('sp_getGrupoVotacion', (id_grupovotacion,))
    for data in cursor.stored_results():
        grupo_votacion = data.fetchall()
    return grupo_votacion
#8. sp_getGrupoVotacionByProvinciaDistritoLocal
@app.route('/<departamento>/<provincia>/<distrito>/<local>/<grupo>')
def get_grupoVotacionByProvinciaDistritoLocalGrupo(departamento, provincia,distrito,local,grupo):
    cursor.callproc('sp_getGrupoVotacionByProvinciaDistritoLocalGrupo', (departamento,provincia,distrito,local,grupo))
    for data in cursor.stored_results():
        grupo_votacion = data.fetchall()
    return grupo_votacion
#9. sp_getLocalesVotacion
@app.route('/locales_votacion/<int:id_distrito>')
def get_locales_votacion(id_distrito):
    cursor.callproc('sp_getLocalesVotacion', (id_distrito,))
    for data in cursor.stored_results():
        locales_votacion = data.fetchall()
    return locales_votacion 
#10. sp_getLocalesVotacionByDistrito
@app.route('/locales_votacion/<provincia>/<distrito>')
def get_locales_votacion_bydistrito(provincia,distrito):
    cursor.callproc('sp_getLocalesVotacionByDistrito', (provincia,distrito,))
    for data in cursor.stored_results():
        locales_votacion = data.fetchall()
    return locales_votacion 
#11. sp_getProvincias
@app.route('/provincias/<int:id>')
def get_provincias(id):
    cursor.callproc('sp_getProvincias', (id,))
    for data in cursor.stored_results():
        provincias = data.fetchall()
    return provincias
#12. sp_getProvinciasByDepartamento
@app.route('/provincias_departamento/<departamento>')
def get_provinciasByDepartamento(departamento):
    cursor.callproc('sp_getProvinciasByDepartamento', (departamento,))
    for data in cursor.stored_results():
        provincias_by_departamentos = data.fetchall()
    return provincias_by_departamentos
#12. sp_getVotos
@app.route('/votos/<inicio>/<fin>')
def get_Votos(inicio, fin):
    cursor.callproc('sp_getVotos', (inicio,fin,))
    for data in cursor.stored_results():
        votos = data.fetchall()
    return votos
#13. sp_getVotosDepartamento
@app.route('/votos_departamento/<departamento>')
def get_VotosDepartamento(departamento):
    cursor.callproc('sp_getVotosDepartamento', (departamento,))
    for data in cursor.stored_results():
        votos_departamento =data.fetchall()
    return votos_departamento
#14. sp_getVotosProvincia
@app.route('/votos_provincia/<provincia>')
def get_VotosProvincia(provincia):
    cursor.callproc('sp_getVotosProvincia', (provincia,))
    for data in cursor.stored_results():
        votos_provincia = data.fetchall()
    return votos_provincia
#15. sp_isDepartamento
@app.route('/is_departamento/<departamento>')
def isDepartamento(departamento):
    cursor.callproc('sp_isDepartamento', (departamento,))
    for data in cursor.stored_results():
        departamento = data.fetchall()
    return departamento
#16. sp_isProvincia
@app.route('/is_provincia/<provincia>')
def isProvincia(provincia):
    cursor.callproc('sp_isProvincia', (provincia,))
    for data in cursor.stored_results():
        provincia = data.fetchall()
    return provincia

if __name__ == '__main__':
    app.run(debug=True)
