const getNacional = async()=>{
    const data = await fetch(`https://oaemdl.es/onpe_sweb_php/participacion/Nacional`)
    if(data.status == 200){
        const departamentos = await data.json()
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
            html+=`
                <tr onclick="location.href='?id=${departamento.DPD}'"onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
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

const getDepartamento = async () => {
    const dep = new URLSearchParams(window.location.search).get('id');
    const data = await fetch(`https://oaemdl.es/onpe_sweb_php/participacion/Nacional/${dep}`);
    if (data.status == 200) {
        const provincias = await data.json();
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
                <tr onclick="location.href='?dep=${dep}&id=${provincia.DPD}'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
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

const getProvincia = async () => {
    const dep = new URLSearchParams(window.location.search).get('dep');
    const pro = new URLSearchParams(window.location.search).get('id');
    const data = await fetch(`https://oaemdl.es/onpe_sweb_php/participacion/Nacional/${dep}/${pro}`);
    if (data.status == 200) {
        const distritos = await data.json();
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
            <tr onclick="location.href='?dep=${dep}&id=${pro}&id=${distrito.DPD}'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
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
    }
};

const getElectores = async()=>{
    const dep = new URLSearchParams(window.location.search).get('dep');
    const pro = new URLSearchParams(window.location.search).get('id');
    const dis = new URLSearchParams(window.location.search).get('id');
    const data = await fetch(`https://oaemdl.es/onpe_sweb_php/participacion/Nacional/${dep}/${pro}/${dis}`)
    if(data.status == 200){
        const votos = await data.json();
        let html=`
        <thead>
            <tr>
            <th>PARTICIPACIÓN</th>
            <th>AUSENTISMO</th>
            </tr>
        </thead>
        <tbody>
        `
        votos.forEach(voto =>{
            html+=`
            <tr>
                <td>TOTAL: ${voto.TV}</td>
                <td>TOTAL: ${voto.TA}</td>
            </tr>
            <tr>
                <td>% TOTAL: ${voto.PTV}</td>
                <td>% TOTAL: ${voto.PTA}</td>
            </tr>
            `
        });
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