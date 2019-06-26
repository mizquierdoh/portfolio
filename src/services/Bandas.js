import Bandas from '../data/Bandas';
import cheerio from 'cheerio';



const urlResurrection = 'http://www.resurrectionfest.es/';
const corsUrl = 'https://cors-anywhere.herokuapp.com/';
const API_ADDRESS = 'https://spotify-api-wrapper.appspot.com';

const ESCENARIOS = ["Main Stage", "Ritual Stage", "Chaos Stage", "Desert Stage"];

function compararFechas(a, b) {
    var fA = a.horaInicio;
    var fB = b.horaInicio;
    return fA - fB;
}

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}

function getEscenario(bandas, escenario, horarios) {
    var bandasEscenario = [];

    bandas.filter(b => b.escenario.trim() === escenario.trim()).forEach(banda => {


        var rowSpan = horarios.indexOf(banda.horaFin.toString()) - horarios.indexOf(banda.horaInicio.toString());
        var horario = horarios.indexOf(banda.horaInicio.toString());

        var vacio = {};
        if (horario !== 0) {
            if (bandasEscenario.length === 0) {
                vacio = { horario: 0, rowSpan: horario };
            }
            else {
                var horarioVacio = bandasEscenario[bandasEscenario.length - 1].horario + bandasEscenario[bandasEscenario.length - 1].rowSpan;
                vacio = {
                    horario: horarioVacio,
                    rowSpan: horario - horarioVacio
                }
            }
            if (vacio.rowSpan !== 0) {
                bandasEscenario.push({
                    banda: { escenario: banda.escenario }, rowSpan: vacio.rowSpan, horario: vacio.horario
                })
            }
        }


        bandasEscenario.push({
            banda, rowSpan, horario
        })
    })

    var restante = horarios.length;
    if (bandasEscenario.length > 0) {

        restante -= bandasEscenario[bandasEscenario.length - 1].horario + bandasEscenario[bandasEscenario.length - 1].rowSpan;
    }
    if (restante > 0) {
        bandasEscenario.push({ banda: { escenario }, horario: horarios.length - restante, rowSpan: restante });
    }
    return bandasEscenario;
}

function tratarNombre(nombre) {
    var nom = nombre.toLowerCase().replace(/\s/g, "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    console.log(nombre, nom);
    return nom;
}


function tratarHTML(html) {
    var bandas = [];
    var nodosDia = Array.from(html.childNodes).filter(node => node.nodeName !== "#text");
    var dia;
    if ('14' === nodosDia[0].childNodes[0].innerText.substring(0, 2)) {
        dia = 6
    }
    else {
        dia = nodosDia[0].childNodes[0].innerText.substring(1, 2);
    }
    nodosDia = nodosDia.slice(1);
    var escenario;
    nodosDia.forEach(nodoDia => {
        var nodosEscenarios = Array.from(nodoDia.childNodes).filter(nodo => nodo.nodeName !== "BR");
        var i = 0;
        nodosEscenarios.forEach(nodoEscenarios => {

            if (i === 0) {
                if (nodoEscenarios.nodeName === "EM") {
                    escenario = nodoEscenarios.innerText;
                }
                else {
                    escenario = nodoEscenarios.textContent;
                }

            }
            else {


                var horaInicio = nodoEscenarios.textContent.substring(1, 6).split(':')[0];
                var minInicio = nodoEscenarios.textContent.substring(1, 6).split(':')[1];
                var horaFin = nodoEscenarios.textContent.substring(9, 14).split(':')[0];
                var minFin = nodoEscenarios.textContent.substring(9, 14).split(':')[1];
                var nombre = nodoEscenarios.textContent.substr(15);
                var diaInicio = dia;
                if (horaInicio < 5) {
                    diaInicio++;
                }
                var diaFin = dia;
                if (horaFin < 5) {
                    diaFin++;
                }
                var personalizado = Bandas.find(band => band.Grupo === nombre.toUpperCase());

                var banda = {
                    id: bandas.length,
                    horaInicio: new Date(2019, 6, diaInicio, horaInicio, minInicio, 0),
                    horaFin: new Date(2019, 6, diaFin, horaFin, minFin, 0),
                    escenario: escenario.trim(),
                    nombre,
                    imagenes: [],
                    generos: [],
                    popularidad: null

                };
                if (personalizado) {
                    banda.preferencia = personalizado.Preferencia;
                    banda.relevancia = personalizado.Relevancia;
                    banda.procedencia = personalizado.Procedencia;
                    banda.descripcion = personalizado.Descripción;
                }





                bandas.push(banda);
            }
            i++;
        })


    })

    return bandas;
}

function getDia(fecha) {
    if (fecha.getHours() < 5) {
        return fecha.getDay() - 4;
    }
    return fecha.getDay() - 3;
}

function actualizarBanda(banda) {
    var dias = JSON.parse(localStorage.getItem('bandas')).map(dia => {

        dia.fecha = new Date(dia.fecha);
        dia.horarios = dia.horarios.map(hora => new Date(hora));
        dia.escenarios = dia.escenarios.map(escenario => {
            return escenario.map(concierto => {
                concierto.banda.horaInicio = new Date(concierto.banda.horaInicio);
                concierto.banda.horaFin = new Date(concierto.banda.horaFin);
                return concierto;
            });
        });

        return dia;
    });

    console.log(getDia(banda.horaInicio));
    dias[getDia(banda.horaInicio)]
        .escenarios[ESCENARIOS.indexOf(banda.escenario)]
        .find(concierto => concierto.banda.id === banda.id).banda = banda;

    localStorage.setItem('bandas', JSON.stringify(dias));
    console.log("Banda actualizada:", banda);

}

export const getBanda = async (banda) => {

    if (!(banda.imagenes.length > 0 || banda.popularidad || banda.generos.length > 0)) {

        banda.imagenes = [];


        var resurrection = await fetch(`${corsUrl}${urlResurrection}/bands/${tratarNombre(banda.nombre)}`)
            .then((response) => {
                return response.text()
            })
            .then(text => {

                var cher = cheerio.load(text);
                const parser = new DOMParser();
                const doc = parser.parseFromString(cher.xml(), 'text/html');
                return doc.querySelector("#page-top > div.wrap.container > div > div.row.rf-main-content > article > div > div.rf16-featured-image.col-md-8.col-lg-8.col-sm-12.col-xs-12 > a > img")

            })
            .catch((error) => null)



        var spotify = await fetch(`${API_ADDRESS}/artist/${banda.nombre}`)
            .then((response) => {
                return response.json();
            })
            .then(json => {
                if (json.artists.total > 0) {
                    const artist = json.artists.items[0];
                    if (artist) {
                        return {
                            imagen: artist.images[0].url,
                            generos: artist.genres,
                            popularidad: artist.popularity
                        }

                    }
                }
                return null;

            })
            .catch((error) => null)
        if (resurrection) {
            console.log(resurrection.src);
            banda.imagenes.push(resurrection.src);
        }

        if (spotify) {
            console.log(spotify);
            banda.imagenes.push(spotify.imagen);
            banda.generos = spotify.generos;
            banda.popularidad = spotify.popularidad;
        }

        actualizarBanda(banda);
    }




    return banda;


}






export function actualizar() {
    return fetch(`${corsUrl}${urlResurrection}/horarios/`)
        .then((response) => {
            return response.text()
        })
        .then(text => {

            var cher = cheerio.load(text);
            const parser = new DOMParser();
            const doc = parser.parseFromString(cher.xml(), 'text/html');
            var miercolesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(14)");
            var juevesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(15)");
            var viernesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(16)");
            var sabadoHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(17)");
            var bandasTemp = [];
            bandasTemp[0] = tratarHTML(miercolesHTML).sort(compararFechas);
            bandasTemp[1] = tratarHTML(juevesHTML).sort(compararFechas);
            bandasTemp[2] = tratarHTML(viernesHTML).sort(compararFechas);
            bandasTemp[3] = tratarHTML(sabadoHTML).sort(compararFechas);

            var bandas = bandasTemp.map((bandasDia, index) => {

                var fecha = new Date(2019, 6, 3 + index, 12, 0, 0);
                var horarios = bandasDia.map(banda => banda.horaInicio)
                    .concat(bandasDia.map(banda => banda.horaFin))
                    .map(fecha => fecha.toString())
                    .filter(unique)
                    .map(fecha => new Date(fecha))
                    .sort((a, b) => a - b);

                var mainStage = getEscenario(bandasDia, "Main Stage", horarios.map(fecha => fecha.toString()));
                var ritualStage = getEscenario(bandasDia, "Ritual Stage", horarios.map(fecha => fecha.toString()));
                var chaosStage = getEscenario(bandasDia, "Chaos Stage", horarios.map(fecha => fecha.toString()));
                var desertStage = getEscenario(bandasDia, "Desert Stage", horarios.map(fecha => fecha.toString()));
                var escenarios = [mainStage, ritualStage, chaosStage, desertStage];



                var dia = {
                    fecha,
                    horarios,
                    escenarios
                };
                return dia;
            }

            )

            localStorage.setItem('bandas', JSON.stringify(bandas));
            return bandas;
        })


        .catch((error) => console.log(error, error.message));
}

