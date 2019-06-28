import Bandas from '../data/Bandas';
import cheerio from 'cheerio';
import resurrection from '../data/resurrection'

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
    return nom;
}

function getDia(fecha) {
    if (fecha.getHours() < 5) {
        return fecha.getDay() - 4;
    }
    return fecha.getDay() - 3;
}

export function getBandasLocalStorage() {
    return JSON.parse(localStorage.getItem('bandas')).map(dia => {

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

}

export function findBandasByName(nombre, bandas = null) {
    if (!nombre)
        return null;

    var dias = getBandasLocalStorage();
    var busqueda = [];

    dias.forEach((dia) => {
        dia.escenarios.forEach((escenario) => {
            busqueda = busqueda.concat(escenario
                .filter((concierto) => concierto.banda.nombre ? concierto.banda.nombre.toLowerCase().indexOf(nombre.toLowerCase()) > -1 : false)
                .map(concierto => concierto.banda))
        })
    })

    return busqueda;

}

export function getBandaById(id) {
    var dias = getBandasLocalStorage();

    for (var i = 0; i < dias.length; i++) {
        for (var j = 0; j < dias[i].escenarios.length; j++) {
            for (var k = 0; k < dias[i].escenarios[j].length; k++) {
                if (dias[i].escenarios[j][k].banda.id === parseInt(id)) {
                    return dias[i].escenarios[j][k].banda;
                }
            }
        }
    }
    return null;

}

export function actualizarBanda(banda) {
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

    dias[getDia(banda.horaInicio)]
        .escenarios[ESCENARIOS.indexOf(banda.escenario)]
        .find(concierto => concierto.banda.id === banda.id).banda = banda;

    console.log(dias[getDia(banda.horaInicio)]
        .escenarios[ESCENARIOS.indexOf(banda.escenario)]
        .find(concierto => concierto.banda.id === banda.id).banda);

    localStorage.setItem('bandas', JSON.stringify(dias));

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
            banda.imagenes.push(resurrection.src);
        }

        if (spotify) {
            banda.imagenes.push(spotify.imagen);
            banda.generos = spotify.generos;
            banda.popularidad = spotify.popularidad;
        }

        actualizarBanda(banda);
    }

    return banda;

}

function parseFecha(fechaString) {

    var fechaHora = fechaString.split(" ");
    var dia = fechaHora[0].split("-");
    var hora = fechaHora[1].split(":");
    var fecha = new Date(dia[0], dia[1] - 1, dia[2], hora[0], hora[1]);
    return fecha;

}

export function actualizar() {

    var bandasTemp = [];
    var idBanda = 0;
    resurrection.locations.forEach(escenario => {
        escenario.events.forEach((concierto) => {

            var banda = {
                id: idBanda,
                horaInicio: parseFecha(concierto.start),
                horaFin: parseFecha(concierto.end),
                escenario: escenario.name + " Stage",
                nombre: concierto.name,
                imagenes: [],
                generos: [],
                popularidad: null
            }
            var personalizado = Bandas.find(band => band.Grupo === banda.nombre.toUpperCase());
            if (personalizado) {
                banda.preferencia = personalizado.Preferencia === "TRUE";
                banda.relevancia = personalizado.Relevancia;
                banda.procedencia = personalizado.Procedencia;
                banda.descripcion = personalizado.Descripción;
            }

            idBanda++;

            if (!bandasTemp[getDia(banda.horaInicio)]) {
                bandasTemp[getDia(banda.horaInicio)] = [];

            }
            bandasTemp[getDia(banda.horaInicio)].push(banda);

        })
    })

    bandasTemp.map(dia => dia.sort(compararFechas));

    var dias = bandasTemp.map((bandasDia, index) => {

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

        return {
            fecha,
            horarios,
            escenarios
        };

    })
    localStorage.setItem('bandas', JSON.stringify(dias));
    return dias;

}
