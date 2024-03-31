const url = window.location.href;
let ambito = url.includes('participacion_total/nacional') ? 'nacional' : 'extranjero';

const getParticipacion = async () => {
    const data = await fetch(`http://127.0.0.1:5000/participacion/${ambito}`);
    if (data.status == 200) {
        const departamentos = await data.json();
        console.log('Metodo getParticipacion: ')
        console.log(departamentos);
        let html = `
            <tr class="titulo_tabla"> 
                <td>DEPARTAMENTO</td>
                <td>TOTAL ASISTENTES</td>
                <td>% TOTAL ASISTENTES</td>
                <td>TOTAL AUSENTES</td>
                <td>% TOTAL AUSENTES</td>
                <td>ELECTORES HÁBILES</td>
            </tr>
        `
        departamentos.forEach(departamento=>{
            //<tr onclick="getDepartamento('${departamento.DPD}'); location.href='/participacion_total/${ambito}/${departamento.DPD}'" onmouseover="this.style.cursor = 'pointer'; this.style.color = 'grey'" onmouseout="this.style.color = 'black'" style="cursor: pointer; color: black;">
            html+=`
            <tr onclick="getDepartamento('${departamento.DPD}'); location.href='/participacion_total/${ambito}/${departamento.DPD}'" onmouseover="this.style.cursor = 'pointer'; this.style.color = 'grey'" onmouseout="this.style.color = 'black'" style="cursor: pointer; color: black;">

                    <td>${departamento.DPD}</td>
                    <td>${departamento.TV}</td>
                    <td>${departamento.PTV}</td>
                    <td>${departamento.TA}</td>
                    <td>${departamento.PTA}</td>
                    <td>${departamento.EH}</td>
                </tr>
            ` 
        });
        
        html+=`
            <tr>
                <td>TOTALES</td>
                <td>17,953,367</td>
                <td>81.543%</td>
                <td>4,063,663</td>
                <td>18.457%</td>
                <td>22,017,030</td>
            </tr>
        `
        document.getElementById('resultados').innerHTML=html
    }
}

let departamentoElegido=''
const getDepartamento = async (departamento) => {
    departamentoElegido=departamento
    const data = await fetch(`http://127.0.0.1:5000/participacion/${ambito}/${departamento}`);
    if (data.status == 200) {
        const provincias = await data.json();
        console.log('Metodo getDepartamento: ')
        console.log(provincias);
        let html = ` 
            <tr class="titulo_tabla">
                <td>PROVINCIA</td>
                <td>TOTAL ASISTENTES</td> 
                <td>% TOTAL ASISTENTES</td>
                <td>TOTAL AUSENTES</td>
                <td>% TOTAL AUSENTES</td>
                <td>ELECTORES HÁBILES</td>
            </tr>
        `;
        provincias.forEach(provincia => {
            html += `
            <tr id="departamento_${departamento.DPD}" onclick="getDepartamento('${departamento.DPD}'); location.href='/participacion_total/${ambito}/${departamento.DPD}'" onmouseover="this.style.cursor = 'pointer'; this.style.color = 'grey'" onmouseout="this.style.color = 'black'" style="cursor: pointer; color: black;">
                    <td>${provincia.DPD}</td>
                    <td>${provincia.TV}</td>
                    <td>${provincia.PTV}</td>
                    <td>${provincia.TA}</td>
                    <td>${provincia.PTA}</td>
                    <td>${provincia.EH}</td>
                </tr>
            `;
        });

        html += `
            <tr>
                <td>TOTALES</td>
                <td>17,953,367</td>
                <td>81.543%</td>
                <td>4,063,663</td>
                <td>18.457%</td>
                <td>22,017,030</td>
            </tr>
        `;
        document.getElementById('resultados').innerHTML = html;
    }
};


const getProvincia = async (departamento,provincia) => {
    const data = await fetch(`http://127.0.0.1:5000/participacion/${ambito}/${departamento}/${provincia}`);
    if (data.status == 200) {
        const distritos = await data.json();
        console.log('Metodo getProvincias: ')
        console.log(distritos);
        let html = `
            <tr class="titulo_tabla">
                <td>DISTRITOS</td>
                <td>TOTAL ASISTENTES</td>
                <td>% TOTAL ASISTENTES</td>
                <td>TOTAL AUSENTES</td>
                <td>% TOTAL AUSENTES</td>
                <td>ELECTORES HÁBILES</td>
            </tr>
        `;
        distritos.forEach(distrito => {
            html += `
            <tr onclick="getProvincia('${departamento.DPD}', '${provincia.DPD}')" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
                    <td>${distrito.DPD}</td>
                    <td>${distrito.TV}</td>
                    <td>${distrito.PTV}</td>
                    <td>${distrito.TA}</td>
                    <td>${distrito.PTA}</td>
                    <td>${distrito.EH}</td>
                </tr>
            `;
        });

        html += `
            <tr>
                <td>TOTALES</td>
                <td>17,953,367</td>
                <td>81.543%</td>
                <td>4,063,663</td>
                <td>18.457%</td>
                <td>22,017,030</td>
            </tr>
        `;
        document.getElementById('resultados').innerHTML = html;
        getDepartamento(departamentos[0].DPD);
    }
};

const getElectores = async(departamento,provincia)=>{
    const data = await fetch(`http://127.0.0.1:5000/participacion/${ambito}/${departamento}/${provincia}`);
    if(data.status == 200){
        const votos = await data.json();
        console.log('Metodo getElectores: ')
        console.log(votos);
        let html=`
        <thead>
            <tr>
            <th>PARTICIPACIÓN</th>
            <th>AUSENTISMO</th>
            </tr>
        </thead>
        <tbody>
        `
        const voto = votos[0]; // Capturar el primer registro
        console.log(voto)
        html+=`
        <tr>
            <td>TOTAL: ${voto.TV}</td>
            <td>TOTAL: ${voto.TA}</td>
        </tr>
        <tr>
            <td>% TOTAL: ${voto.PTV}</td>
            <td>% TOTAL: ${voto.PTA}</td>
        </tr>
        `;
        html +=`
            </tbody>
        `
        document.getElementById('tablaparticipacion').innerHTML = html;
    }
}


/*
<thead>
    <tr>
    <th>PARTICIPACIÓN</th>
    <th>AUSENTISMO</th>
    </tr>
</thead>
<tbody>
    <tr>
    <td>TOTAL: 17,953,367</td>
    <td>TOTAL: 4,063,663</td>
    </tr>
    <tr>
    <td>% TOTAL: 81.543%</td>
    <td>% TOTAL: 18.457%</td>
    </tr>
</tbody>


        <tr class="titulo_tabla">
            <td>DEPARTAMENTO</td>
            <td>TOTAL ASISTENTES</td>
            <td>% TOTAL ASISTENTES</td>
            <td>TOTAL AUSENTES</td>
            <td>% TOTAL AUSENTES</td>
            <td>ELECTORES HÁBILES</td>
        </tr>
        <tr onclick="location.href='./participacion_total.html?id=nacional,AMAZONAS'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
            <td>AMAZONAS</td>
            <td>182,570</td>
            <td>67.575%</td>
            <td>87,605</td>
            <td>32.425%</td>
            <td>270,175</td>
        </tr>
        <tr>
            <td>TOTALES</td>
            <td>17,953,367</td>
            <td>81.543%</td>
            <td>4,063,663</td>
            <td>18.457%</td>
            <td>22,017,030</td>
        </tr>
*/