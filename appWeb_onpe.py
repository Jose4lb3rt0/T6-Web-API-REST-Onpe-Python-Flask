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

#1.Actas Ubigeo:
@app.route('/actas_ubigeo')
def actas_ubigeo():
    return render_template('actas_ubigeo.html')
#1.1.1. API REST de continentes extranjero (devuelve el continente)
@app.route('/actas/ubigeo/')
def get_departamentosExtranjero():
    cursor.callproc('sp_getDepartamentos', (26, 30))
    for data in cursor.stored_results():
        continentes = data.fetchall()
    return continentes
#1.1.2. API REST de departamentos Peruanos (devuelve departamentos)
@app.route('/actas/ubigeo/Peru/')
def get_departamentosPeru():
    cursor.callproc('sp_getDepartamentos', (1, 25))
    for data in cursor.stored_results():
        departamentos = data.fetchall()
    return departamentos
#1.1.3. Selección de las rutas de ubigeo (Extranjero o Peru)
@app.route('/actas/ubigeo/<ambito>') #Este va al javascript
def get_seleccionAmbito(ambito):
    if ambito == 'Peru':
        cursor.callproc('sp_getDepartamentos', (1, 25))
    else:
        cursor.callproc('sp_getDepartamentos', (26, 30))
    for data in cursor.stored_results():
        resultadoAmbito = data.fetchall()
    return resultadoAmbito
#1.2. API REST para entrar en el departamento y devolver las provincias
@app.route('/actas/ubigeo/<ambito>/<departamento>')
def get_provinciasPorDepartamento(ambito,departamento): # Dos parametros para acceder a la api desde su URL
    cursor.callproc('sp_getProvinciasByDepartamento', (departamento,)) # Un solo parametro para la sentencia
    for data in cursor.stored_results():
        provincias = data.fetchall()
    return provincias
#1.3. API REST para entrar en la provincia y devolver los distritos
@app.route('/actas/ubigeo/<ambito>/<departamento>/<provincia>')
def get_distritosPorProvincia(ambito,departamento,provincia):
    cursor.callproc('sp_getDistritosByProvincia', (provincia,))
    for data in cursor.stored_results():
        distritos = data.fetchall()
    return distritos
#1.4. API REST para entrar en los distritos y devolver los locales de votacion
@app.route('/actas/ubigeo/<ambito>/<departamento>/<provincia>/<distrito>')
def get_localesPorDistrito(ambito,departamento,provincia,distrito):
    cursor.callproc('sp_getLocalesVotacionByDistrito', (provincia,distrito,))
    for data in cursor.stored_results():
        localesVotacion = data.fetchall()
    return localesVotacion
#1.5. API REST para entrar en los locales y devolver los grupos de votacion
@app.route('/actas/ubigeo/<ambito>/<departamento>/<provincia>/<distrito>/<local>')
def get_gruposPorProvinciaYDistrito(ambito, departamento, provincia, distrito, local):
    cursor.callproc('sp_getGruposVotacionByProvinciaDistritoLocal', (provincia, distrito, local,))
    for data in cursor.stored_results():
        gruposVotacion = data.fetchall()
    return gruposVotacion


#2. Actas Numero:
@app.route('/actas_numero')
def actas_numero():
    return render_template('actas_numero.html')
#2.1. Recoger los detalles de las mesas 
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