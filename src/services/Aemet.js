const AEMET_URL_MUNICIPIO = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio";

const CORS_URL = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWg5MDExQGhvdG1haWwuY29tIiwianRpIjoiMzk4NzhmMjYtZmY5ZS00NmZmLWIxMzItZDE5YmFlNjRkZDlkIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1NjE3MjM5ODUsInVzZXJJZCI6IjM5ODc4ZjI2LWZmOWUtNDZmZi1iMTMyLWQxOWJhZTY0ZGQ5ZCIsInJvbGUiOiIifQ.jiNdh0FtrTODU501HCWBVkuODeiSYJm0_gV1LFd1MnQ";
export function getWeather() {

    //HORARIA
    fetch(CORS_URL + AEMET_URL_MUNICIPIO + "/horaria/27066?api_key=" + API_KEY)
        .then(response => response.json())
        .then(json => {
            fetch(json.datos).then(datos => datos.json())
                .then(json => {
                    var prediccion = [];
                    console.log(json[0].prediccion.dia);

                    json[0].prediccion.dia.forEach(d => {
                        d.estadoCielo.forEach(estado => {
                            var fecha = d.fecha.split("-");
                            var hora = new Date(fecha[0], fecha[1] - 1, fecha[2], estado.periodo);
                            prediccion.push({ hora, estado: estado.descripcion });
                        })

                    })
                    console.log(prediccion);
                    return prediccion;
                })

        });
}