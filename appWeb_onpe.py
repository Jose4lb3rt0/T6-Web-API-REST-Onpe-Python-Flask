from flask import Flask, render_template, redirect, request
import mysql.connector
from db_config import configRemote, config

#Cambiar a config si la base remota empieza a fallar
cnx = mysql.connector.connect(**config)
cursor = cnx.cursor(dictionary=True)
app = Flask(__name__)

#Index
@app.route('/')
def on():
    return redirect('/index')
@app.route('/index')
def index():
    return render_template('selector.html')

#1. Actas Ubigeo TEMPLATE:
@app.route('/actas_ubigeo')
def actas_ubigeo():
    return render_template('actas_ubigeo.html')

#1.2. Actas Ubigeo API REST Peru
@app.route('/actas/ubigeo/Peru/') #
def ApiRest_ActasUbigeoPeru():
    cursor.callproc('sp_getDepartamentos', (1, 25))
    for data in cursor.stored_results():
        departamentos = data.fetchall()
    return departamentos
#1.3. Actas Ubigeo API REST Extranjero
@app.route('/actas/ubigeo/Extranjero/')
def ApiRest_ActasUbigeoExtranjero():
    cursor.callproc('sp_getDepartamentos', (26, 30))
    for data in cursor.stored_results():
        continentes = data.fetchall()
    return continentes
#1.4. API REST Selección de ambitos (Peruano o Extranjero):
@app.route('/actas/ubigeo/<ambito>') 
def get_seleccionAmbito(ambito):
    if ambito == 'Extranjero':
        cursor.callproc('sp_getDepartamentos', (26, 30))
    else:
        cursor.callproc('sp_getDepartamentos', (1, 25))
    for data in cursor.stored_results():
        resultadoAmbito = data.fetchall()
    print(ambito)
    return resultadoAmbito
#1.5. Actas Ubigeo API REST Ambito -> Departamento = Devuelve las provincias:
@app.route('/actas/ubigeo/<ambito>/<departamento>')
def get_provinciasPorDepartamento(ambito,departamento): 
    cursor.callproc('sp_getProvinciasByDepartamento', (departamento,))
    for data in cursor.stored_results():
        provincias = data.fetchall()
    return provincias
#1.6. Actas Ubigeo API REST Ambito -> Departamento -> Provincias = Devuelve los distritos:
@app.route('/actas/ubigeo/<ambito>/<departamento>/<provincia>')
def get_distritosPorProvincia(ambito,departamento,provincia):
    cursor.callproc('sp_getDistritosByProvincia', (provincia,))
    for data in cursor.stored_results():
        distritos = data.fetchall()
    return distritos
#1.7. Actas Ubigeo API REST Ambito -> Departamento -> Provincias -> Distritos = Devuelve los locales:
@app.route('/actas/ubigeo/<ambito>/<departamento>/<provincia>/<distrito>')
def get_localesPorDistrito(ambito,departamento,provincia,distrito):
    cursor.callproc('sp_getLocalesVotacionByDistrito', (provincia,distrito,))
    for data in cursor.stored_results():
        localesVotacion = data.fetchall()
    return localesVotacion
#1.8. Actas Ubigeo API REST Ambito -> Departamento -> Provincias -> Distritos -> Locales = Devuelve los grupos:
@app.route('/actas/ubigeo/<ambito>/<departamento>/<provincia>/<distrito>/<local>')
def get_gruposPorProvinciaYDistrito(ambito, departamento, provincia, distrito, local):
    cursor.callproc('sp_getGruposVotacionByProvinciaDistritoLocal', (provincia, distrito, local,))
    for data in cursor.stored_results():
        gruposVotacion = data.fetchall()
    return gruposVotacion

#2. Actas Numero - TEMPLATE:
@app.route('/actas_numero')
def actas_numero():
    return render_template('actas_numero.html')
#2.1. Actas Numero - API REST: 
@app.route('/actas/numero/<id_GrupoVotacion>')
def get_GrupoVotacion(id_GrupoVotacion):
    cursor.callproc('sp_getGrupoVotacion', (id_GrupoVotacion,))
    for data in cursor.stored_results():
        grupo_votacion = data.fetchone()
    return grupo_votacion


#3. Participación TEMPLATE
@app.route('/participacion')
def participacion():
    return render_template('participacion.html')
#3.1. Participación Total TEMPLATE Ambito
@app.route('/participacion_total/<ambito>')
def participacion_total_ambito(ambito):
    return render_template('participacion_total.html')
#3.2. Participacion Total TEMPLATE Ambito -> Departamentos -> Devuelve las provincias
@app.route('/participacion_total/<ambito>/<departamento>')
def get_participacionDepartamento(ambito, departamento):
    return render_template('participacion_total.html')
#3.2. Participacion Total TEMPLATE Ambito -> Departamentos -> Devuelve las provincias
@app.route('/participacion_total/<ambito>/<departamento>/<provincia>')
def get_participacionProvincia(ambito, departamento,provincia):
    return render_template('participacion_total.html')

#3.3. Participacion API REST Peru
@app.route('/participacion/Nacional/') #
def ApiRest_ParticipacionNacional():
    cursor.callproc('sp_getVotos', (1, 25))
    for data in cursor.stored_results():
        votosNacional = data.fetchall()
    return votosNacional
#3.4. Participacion API REST Extranjero
@app.route('/participacion/Extranjero/')
def ApiRest_ParticipacionExtranjero():
    cursor.callproc('sp_getVotos', (26, 30))
    for data in cursor.stored_results():
        votosExtranjero = data.fetchall()
    return votosExtranjero
#3.5. Participación Total API REST Selección de Ambito (Extranjero o Peru) -> Devuelve los departamento
@app.route('/participacion/<ambito>')
def get_votosPorAmbito(ambito):
    print (ambito)
    if ambito == 'extranjero':
        cursor.callproc('sp_getVotos', (26, 30))
    elif ambito == 'nacional':
        cursor.callproc('sp_getVotos', (1, 25))
    for data in cursor.stored_results():
        resultado_votosAmbito = data.fetchall()
    return resultado_votosAmbito
#3.6. Participacion Total API REST Ambito -> Departamentos -> Devuelve las provincias
@app.route('/participacion/<ambito>/<departamento>')
def get_votosPorDepartamento(ambito, departamento):
    cursor.callproc('sp_getVotosDepartamento', (departamento,)) 
    for data in cursor.stored_results():
        resultado_votosDepartamento = data.fetchall()
    return resultado_votosDepartamento
#3.7. Participacion Total API REST Ambito -> Departamentos -> Provincia -> Devuelve los distritos
@app.route('/participacion/<ambito>/<departamento>/<provincia>')
def get_votosPorProvincia(ambito, departamento,provincia):
    cursor.callproc('sp_getVotosProvincia', (provincia,)) 
    for data in cursor.stored_results():
        resultado_votosProvincia = data.fetchall()
    return resultado_votosProvincia

if __name__== '__main__':
    #Host y puerto, bien importante para que funcione el link que va al javascript
    app.run(host='127.0.0.1', port=5000,debug=True)