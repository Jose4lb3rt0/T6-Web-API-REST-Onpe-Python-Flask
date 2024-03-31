const lblDepartamento = document.getElementById('lblDepartamento');
const lblProvincia = document.getElementById('lblProvincia');
const lblDistrito = document.getElementById('lblDistrito');
let ambito=''

const getAmbito = async(ubigeo)=>{
    ambito=ubigeo
    const data = await fetch(`http://127.0.0.1:5000/actas/ubigeo/${ambito}`) //Tener cuidado con slash al final
    console.log(ambito)
    if (ubigeo === 'Extranjero') {
      lblDepartamento.textContent = 'Continente: ';
      lblProvincia.textContent = 'País: ';
      lblDistrito.textContent = 'Ciudad: ';
    } else if (ubigeo === 'Peru') {
        lblDepartamento.textContent = 'Departamento: ';
        lblProvincia.textContent = 'Provincia: ';
        lblDistrito.textContent = 'Distrito: ';
    }
  
    if (data.status == 200){
        const departamentos = await data.json()
        let html = `<select name="cdgoDep" id="cdgoDep" class="form-control" onchange="getProvincias(this.value);">
            <option selected="selected" value="">--SELECCIONE--</option>`
        departamentos.forEach(departamento => {
            html += `<option value="${departamento.Detalle}">${departamento.Detalle}</option>`
        });
        html += `</select>`
        document.getElementById('departamentos').innerHTML=html

        document.getElementById('provincias').innerHTML = `<select name="cdgoProv" id="cdgoProv" class="form-control" onchange="getDistritos(this.value);" disabled>;
            <option selected="selected" value="" disabled>--SELECCIONE--</option>`

        document.getElementById('distritos').innerHTML = `
        <select name="cdgoDist" id="cdgoDist" class="form-control" onchange="getLocales(this.value);" disabled>;
        <option selected="selected" value="" disabled>--SELECCIONE--</option>`

        document.getElementById('divLocal').innerHTML = `
        <select name="actas_ubigeo" id="actas_ubigeo" class="form-control" disabled>
        <option selected="selected" value="" disabled>--SELECCIONE--</option>`
        html += `</select>`

        document.getElementById('divMesas').innerHTML=``

        document.getElementById('divDetalle').innerHTML = ``
    }else{
      document.getElementById('departamentos').innerHTML=`<select name="cdgoProv" id="cdgoProv" class="form-control" onchange="getDistritos(this.value);" disabled>;
      <option selected="selected" value="" disabled>--SELECCIONE--</option>`

      document.getElementById('provincias').innerHTML = `<select name="cdgoProv" id="cdgoProv" class="form-control" onchange="getDistritos(this.value);" disabled>;
          <option selected="selected" value="" disabled>--SELECCIONE--</option>`

      document.getElementById('distritos').innerHTML = `
      <select name="cdgoDist" id="cdgoDist" class="form-control" onchange="getLocales(this.value);" disabled>;
      <option selected="selected" value="" disabled>--SELECCIONE--</option>`

      document.getElementById('divLocal').innerHTML = `
      <select name="actas_ubigeo" id="actas_ubigeo" class="form-control" disabled>
      <option selected="selected" value="" disabled>--SELECCIONE--</option>`

      document.getElementById('divMesas').innerHTML=``

      document.getElementById('divDetalle').innerHTML = ``
    }
}

let departamentoElegido=''
const getProvincias = async(departamento) =>{
    departamentoElegido=departamento
    const data = await fetch(`http://127.0.0.1:5000/actas/ubigeo/${ambito}/${departamento}`)
    if (data.status == 200){ 
        const provincias = await data.json()
        let html = `<select name="cdgoProv" id="cdgoProv" class="form-control" onchange="getDistritos(this.value);">;
            <option selected="selected" value="">--SELECCIONE--</option>`

        if (Array.isArray(provincias)) {
          provincias.forEach(provincia => {
              html += `<option value="${provincia.Detalle}">${provincia.Detalle}</option>`;
          });
        } else {
            html += `<option value="${provincias.Detalle}">${provincias.Detalle}</option>`;
        }

        html += `</select>`
        document.getElementById('provincias').innerHTML=html

        document.getElementById('distritos').innerHTML = `
        <select name="cdgoDist" id="cdgoDist" class="form-control" onchange="getLocales(this.value);" disabled>;
        <option selected="selected" value="" disabled>--SELECCIONE--</option>`

        document.getElementById('divLocal').innerHTML = `
        <select name="actas_ubigeo" id="actas_ubigeo" class="form-control" disabled>
        <option selected="selected" value="" disabled>--SELECCIONE--</option>`
        html += `</select>`

        document.getElementById('divMesas').innerHTML=``

        document.getElementById('divDetalle').innerHTML = ``
    }
}

let provinciaElegida=''
const getDistritos = async (provincia) => {
    provinciaElegida=provincia
    const data = await fetch(`http://127.0.0.1:5000/actas/ubigeo/${ambito}/${departamentoElegido}/${provincia}`)
    if (data.status == 200) {
        const distritos = await data.json();
        let html = `
        <select name="cdgoDist" id="cdgoDist" class="form-control" onchange="getLocales(this.value);">
        <option selected="selected" value="">--SELECCIONE--</option>`
        
        if (Array.isArray(distritos)) {
          distritos.forEach(distrito => {
              html += `<option value="${distrito.Detalle}">${distrito.Detalle}</option>`;
          });
        } else {
            html += `<option value="${distritos.Detalle}">${distritos.Detalle}</option>`;
        }

        html += `</select>`
        document.getElementById('distritos').innerHTML=html

        document.getElementById('divLocal').innerHTML = `
        <select name="actas_ubigeo" id="actas_ubigeo" class="form-control" disabled>
        <option selected="selected" value="" disabled>--SELECCIONE--</option>`
        html += `</select>`

        document.getElementById('divMesas').innerHTML=``

        document.getElementById('divDetalle').innerHTML = ``
    }
}

let distritoElegido=''
const getLocales = async(distrito)=>{
    distritoElegido = distrito
    const data = await fetch(`http://127.0.0.1:5000/actas/ubigeo/${ambito}/${departamentoElegido}/${provinciaElegida}/${distrito}`)
    if (data.status == 200){
        const locales = await data.json();
        let html = `
        <select name="actas_ubigeo" id="actas_ubigeo" class="form-control" onchange="getMesas(this.value);">
        <option value="" selected="selected">--SELECCIONE--</option>
        `
        
        if (locales.length > 1) {
          locales.forEach(local => {
              html += `<option value="${local.RazonSocial}">${local.RazonSocial}</option>`;
          });
        } else if (locales.length === 1) {
            html += `<option value="${locales[0].RazonSocial}">${locales[0].RazonSocial}</option>`;
        }
      
        html += `</select>`
        document.getElementById('divLocal').innerHTML=html

        document.getElementById('divMesas').innerHTML=``

        document.getElementById('divDetalle').innerHTML = ``
        num+=parseInt(1)
    }
}

let localElegido=''
con = parseInt(0)
const getMesas = async(local)=>{
    const procesacon = staticUrl + "images/procesacon.jpg";
    const procesasin = staticUrl + "images/procesasin.jpg";
    const sinprocesa = staticUrl + "images/sinprocesa.jpg";
    con = parseInt(0)
    localElegido=local
    const data = await fetch(`http://127.0.0.1:5000/actas/ubigeo/${ambito}/${departamentoElegido}/${provinciaElegida}/${distritoElegido}/${local}`)
    if (data.status==200){
        const mesas = await data.json();
        let html = `
            <div class="col-xs-12 pbot30">
                <p class="subtitle">LISTADO DE MESAS</p>
                    <div id="page-wrap">
                        <table class="table17" cellspacing="0">
                            <tbody>
                            <tr>
        `
        num = parseInt(0)
        mesas.forEach(mesa=>{
            html += `
                <td bgcolor="#C1C1C1" onclick="getDetalleMesa('${mesa.idGrupoVotacion}')" style="cursor:pointer"><a href="#">${mesa.idGrupoVotacion}</a></td>
            `
            con += parseInt(1)
            num+=parseInt(1)
            if(num==10){
                html+=`</tr><tr>`
                num = parseInt(0)
            }
        })
        html+=`
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="col-xs-12 cont-recto oculto-leyenda-color-fondo-mesas">
                        <div class="col-md-4"><img src="${procesacon}"> Procesada con imagen</div>
                        <div class="col-md-4"><img src="${procesasin}"> Procesada sin imagen</div>
                        <div class="col-md-4"><img src="${sinprocesa}"> Sin procesar</div>
                      </div>
        
                      <div class="row pbot30">
                        <div class="col-lg-8 centered">
                          <div class="col-xs-12 col-md-12 col-lg-12">
                            <table>
                              <tbody>
                                <tr>
                                  <td colspan="10">
                                    <div class="conte-paginador">
                                      <span class="paginador-txt">Total de mesas: ${num}</span>
                                    </div>
                                  </td>
                                </tr>  
                                <tr>
                                  <td>&nbsp;</td>
                                </tr>
                                <tr>
                                  <td colspan="10">Página: 
                                    <ul class="pagination">
                                      <li class="active"><a class="paginador-n1">1</a></li>
                                    </ul>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
        `
        document.getElementById('divMesas').innerHTML=html
    }
}

const getDetalleMesa = async(mesa)=>{
  const imagenPPK = staticUrl + "images/simbolo_pkk.jpg";
  const imagenFuerzaPopular = staticUrl + "images/simbolo_keyko.jpg";
  const imagenHoja = staticUrl + "images/mp-sin.jpg";
  const data = await fetch(`http://127.0.0.1:5000/actas/numero/${mesa}`)
    if (data.status == 200){
        const acta = await data.json();
        
        document.getElementById('divDetalle').innerHTML = `
          <button class="btn btn-primary pull-right" onclick="getAmbito()" type="button">
          <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          REGRESAR
        </button>
        <p>&nbsp;</p>

        <div class="row">
          <div class="tab-info">
            <div class="tab-content">
              <div id="detMesa">
                <div class="tab-content">
                  <div role="tabpanel" class="tab-pane active" id="presidencial">
                    <div class="tab-info-desc">
                      
                      <div class="row">

                        <div class="col-xs-3 col-md-4">
                          <div class="mesap01">
                            <img src="${imagenHoja}" class="img-responsive">
                            Si requiere la imagen del acta, solicítela a través del procedimiento de acceso a la información pública.
                          </div>
                        </div>
                        <div class="col-xs-9 col-md-8">
                          <div class="row">
                            
                            <div class="col-xs-12">
                              <p class="subtitle1">ACTA ELECTORAL</p>
                              <div id="page-wrap">

                                <table class="table13" cellspacing="0">
                                  <thead>
                                    <tr>
                                      <th>Mesa N°</th>
                                      <th>N° Copia</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>${acta.idGrupoVotacion}</td>
                                      <td>${acta.nCopia}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                              </div>
                            </div>
                
                            <div class="col-xs-12">
                              <p class="subtitle1">INFORMACIÓN UBIGEO</p>
                              <div id="page-wrap">
                                <table class="table14" cellspacing="0">
                                  <tbody>
                                    <tr class="titulo_tabla">
                                      <td>Departamento</td>
                                      <td>Provincia</td>
                                      <td>Distrito</td>
                                      <td>Local de votación</td>
                                      <td>Dirección</td>
                                    </tr>
                                    <tr>
                                      <td>${acta.Departamento}</td>
                                      <td>${acta.Provincia}</td>
                                      <td>${acta.Distrito}</td>
                                      <td>${acta.RazonSocial}</td>
                                      <td>${acta.Direccion}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                
                            <div class="col-xs-12">
                              <p class="subtitle1">INFORMACIÓN MESA</p>
                              <div id="page-wrap">
                                <table class="table15" cellspacing="0">
                                  <tbody>
                                    <tr class="titulo_tabla">
                                      <td>Electores hábiles</td>
                                      <td>Total votantes</td>
                                      <td>Estado del acta</td>
                                    </tr>
                                    <tr>
                                      <td>${acta.ElectoresHabiles}</td>
                                      <td>${acta.TotalVotantes}</td>
                                      <td>${acta.idEstadoActa}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                
                      <div>
                        <div class="col-xs-12 pbot30_acta">
                          <p class="subtitle1">LISTA DE RESOLUCIONES</p>
                          <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> No hay resoluciones para el acta seleccionada
                          <div id="page-wrap">
                            <div class="col-md-12 resolu"></div>
                          </div>
                        </div>
                      </div>
                
                      <div>
                        <div class="col-xs-12">
                          <p class="subtitle1">INFORMACIÓN DEL ACTA ELECTORAL</p>
                          <div id="page-wrap" class="cont-tabla1">
                            <table class="table06">
                              <tbody>
                                <tr class="titulo_tabla">
                                  <td colspan="2">Organización política</td>
                                  <td>Total de Votos</td>
                                </tr>
                                  <td>PERUANOS POR EL KAMBIO</td>
                                  <td><img width="40px" height="40px" src="${imagenPPK}"></td>
                                  <td>${acta.P1}</td>
                                </tr>
                                <tr>
                                  <td>FUERZA POPULAR</td>
                                  <td><img width="40px" height="40px" src="${imagenFuerzaPopular}"></td>
                                  <td>${acta.P2}</td>
                                </tr>
                                <tr>
                                  <td colspan="2">VOTOS EN BLANCO</td>
                                  <td>${acta.VotosBlancos}</td>
                                </tr>
                                <tr>
                                  <td colspan="2">VOTOS NULOS</td>
                                  <td>${acta.VotosNulos}</td>
                                </tr>
                                <tr>
                                  <td colspan="2">VOTOS IMPUGNADOS</td>
                                  <td>${acta.VotosImpugnados}</td>
                                </tr>
                                <tr>
                                  <td colspan="2">TOTAL DE  VOTOS EMITIDOS</td>
                                  <td>${acta.TotalVotantes}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                
                    </div>
                  </div>
                </div>				
              
              </div>
            </div>
          </div>
        </div>
            
      </div>
    `
  }
}
