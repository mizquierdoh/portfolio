const AEMET_URL_MUNICIPIO = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio";

const CORS_URL = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWg5MDExQGhvdG1haWwuY29tIiwianRpIjoiMzk4NzhmMjYtZmY5ZS00NmZmLWIxMzItZDE5YmFlNjRkZDlkIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1NjE3MjM5ODUsInVzZXJJZCI6IjM5ODc4ZjI2LWZmOWUtNDZmZi1iMTMyLWQxOWJhZTY0ZGQ5ZCIsInJvbGUiOiIifQ.jiNdh0FtrTODU501HCWBVkuODeiSYJm0_gV1LFd1MnQ";
export function getWeather() {

    //HORARIA
    const horaria = fetch(CORS_URL + AEMET_URL_MUNICIPIO + "/horaria/27066?api_key=" + API_KEY)
        .then(response => response.json())
        .then(json => {
            return fetch(json.datos).then(datos => datos.json())
                .then(json => {

                    let prediccion = [];
                    json[0].prediccion.dia.forEach(d => {
                        var fecha = d.fecha.split("-");
                        d.estadoCielo.forEach(estado => {

                            var hora = new Date(fecha[0], fecha[1] - 1, fecha[2], estado.periodo);
                            if (prediccion.find(p => p.hora.getTime() === hora.getTime())) {
                                prediccion.find(p => p.hora.getTime() === hora.getTime())
                                    .estadoCielo = { valor: estado.value, descrpcion: estado.descripcion };
                            }
                            else {
                                prediccion.push({ hora, estadoCielo: { valor: estado.value, descrpcion: estado.descripcion } });
                            }
                        })

                        d.temperatura.forEach(t => {

                            var hora = new Date(fecha[0], fecha[1] - 1, fecha[2], t.periodo);
                            if (prediccion.find(p => p.hora.getTime() === hora.getTime())) {
                                prediccion.find(p => p.hora.getTime() === hora.getTime()).temperatura = t.value;
                            }
                            else {
                                prediccion.push({ hora, temperatura: t.value });
                            }
                        })

                    })
                    return prediccion
                })

        });

    const diaria = fetch(CORS_URL + AEMET_URL_MUNICIPIO + "/diaria/27066?api_key=" + API_KEY)
        .then(response => response.json())
        .then(json => {
            return fetch(json.datos).then(datos => datos.json())
                .then(json => {
                    let prediccion = [];
                    json[0].prediccion.dia.forEach(d => {
                        var fecha = d.fecha.split("-");
                        d.estadoCielo.forEach((estado) => {
                            var horaExacta = estado.periodo ? estado.periodo.split("-")[0] : 0;
                            var hora = new Date(fecha[0], fecha[1] - 1, fecha[2], horaExacta);
                            if (!prediccion.find(p => p.hora.getTime() === hora.getTime())) {
                                prediccion.push({ hora, estadoCielo: { valor: estado.value, descrpcion: estado.descripcion } });
                            }
                            else if (prediccion.find(p => p.hora.getTime() === hora.getTime() && !p.estadoCielo)) {
                                prediccion.estadoCielo = { hora, estadoCielo: { valor: estado.value, descripcion: estado.descripcion } };
                            }
                        })
                        if (d.temperatura.dato.length) {
                            d.temperatura.dato.forEach(t => {

                                var hora = new Date(fecha[0], fecha[1] - 1, fecha[2], t.hora);
                                if (!prediccion.find(p => p.hora.getTime() === hora.getTime())) {

                                    prediccion.push({ hora, temperatura: t.value });

                                }
                                else if (prediccion.find(p => p.hora.getTime() === hora.getTime() && !p.temperatura)) {
                                    prediccion.find(p => p.hora.getTime() === hora.getTime()).temperatura = t.value;
                                }
                            })
                        } else {
                            var hora = new Date(fecha[0], fecha[1] - 1, fecha[2])
                            var temperatura = d.temperatura.minima + "/" + d.temperatura.maxima
                            if (!prediccion.find(p => p.hora.getTime() === hora.getTime())) {

                                prediccion.push({ hora, temperatura });

                            }
                            else if (prediccion.find(p => p.hora.getTime() === hora.getTime() && !p.temperatura)) {
                                prediccion.find(p => p.hora.getTime() === hora.getTime()).temperatura = temperatura;
                            }
                        }
                    })
                    return prediccion;
                })
        })

    return Promise.all([horaria, diaria]).then((valores) => {

        valores[1].forEach(v => {
            if (valores[0].find(p => p.hora.getTime() === v.hora.getTime())) {
                if (!valores[0].find(p => p.hora.getTime() === v.hora.getTime()).estadoCielo) {
                    valores[0].find(p => p.hora.getTime() === v.hora.getTime()).estadoCielo = v.estadoCielo;
                }
                if (!valores[0].find(p => p.hora.getTime() === v.hora.getTime()).temperatura) {
                    valores[0].find(p => p.hora.getTime() === v.hora.getTime()).estadoCielo = v.temperatura;
                }

            }
            else {
                valores[0].push(v);
            }
        })

        return valores[0].sort((a, b) => a.hora.getTime() - b.hora.getTime())
    });
}