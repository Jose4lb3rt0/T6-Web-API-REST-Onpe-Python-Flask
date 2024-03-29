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

#3. Participación
@app.route('/participacion')
def participacion():
    return render_template('participacion.html')
#3.1. Participación extranjero
@app.route('/participacion_total/extranjero')
def participacion_totalExtranjero():
    return render_template('participacion_total.html')
#3.2. Participación nacional
@app.route('/participacion_total/nacional')
def participacion_totalNacional():
    return render_template('participacion_total.html')
#3.3. Ruta para departamento valido para extranjero y nacional
@app.route('/participacion_total/<ambito>/<departamento>')
def get_templateDepartamentos(ambito, departamento):
    cursor.callproc('sp_getVotosDepartamento', (departamento,))
    for data in cursor.stored_results():
        departamentos = data.fetchall()
    return render_template('participacion_total.html')

# 3.3. API REST votos extranjeros
@app.route('/participacion/Extranjero')
def get_votosExtranjero():
    cursor.callproc('sp_getVotos', (26, 30))
    for data in cursor.stored_results():
        votos_extranjero = data.fetchall()
    return votos_extranjero

# 3.4. API REST votos nacionales
@app.route('/participacion/Nacional')
def get_votosNacionales():
    cursor.callproc('sp_getVotos', (1, 25))
    for data in cursor.stored_results():
        votos_nacionales = data.fetchall()
    return votos_nacionales
# 3.5. Selección de las rutas de ubigeo (Extranjero o Peru)
@app.route('/participacion/<ambito>')
def get_votosPorAmbito(ambito):
    if ambito == 'Nacional':
        cursor.callproc('sp_getVotos', (1, 25))
    else:
        cursor.callproc('sp_getVotos', (26, 30))
    for data in cursor.stored_results():
        resultado_votosAmbito = data.fetchall()
    return resultado_votosAmbito
# 3.6. API REST votos de departamento
@app.route('/participacion/<ambito>/<departamento>')
def get_votosPorDepartamento(ambito, departamento):
    cursor.callproc('sp_getVotosDepartamento', (departamento,)) 
    for data in cursor.stored_results():
        resultado_votosDepartamento = data.fetchall()
    return resultado_votosDepartamento
# 3.7. API REST votos de provincia
@app.route('/participacion/<ambito>/<departamento>/<provincia>')
def get_votosPorProvincia(ambito, departamento,provincia):
    cursor.callproc('sp_getVotosProvincia', (provincia,)) 
    for data in cursor.stored_results():
        resultado_votosProvincia = data.fetchall()
    return resultado_votosProvincia

if __name__== '__main__':
    app.run(debug=True)