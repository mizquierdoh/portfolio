# Resurrection Fest 2019

Esta aplicación ha sido mi forma de manejar el hype para el festival en estas últimas semanas. 

La información se guarda en el teléfono y en ningún momento se guarda en ninguna base de datos. La aplicación funciona desde el navegador y no es necesario instalar nada.

Es la segunda vez que voy al festival, la primera fue en 2017; y me di cuenta de varias cosas. 

- **Muchas bandas:** El festival tiene una grandísima y muy buena oferta de bandas y muchas nos las conocía, por lo que intenté escucharlas antes para poder hacerme una ida de a qué conciertos ir. Más adelante, durante el festival me hubiera gustado tomar alguna nota y apuntarme las bandas para más tarde.

- **Horarios:** Aunque el festival da los horarios bien explicados y su aplicación era maravillosa, yo soy un desastre y muchas veces ni me acordaba a los grupos que quería ver, sobre todo con los que no conocía, así que pensé que sería una buena idea tener toda la información en un mismo sitio.

- **Porque puedo:** Estoy aprendiendo a manejarme con React y, a la vez que aprendo, voy haciendo esto.

## Características

### Horarios
Son los mismos que la web, de hecho están sacados del [clashfinder](https://clashfinder.com/s/resurrectionfesteg2019/). Se recomienda ver con el móvil en horizontal

- **Botón actualizar:** Limpia los datos locales y carga los datos por defecto.
- **Botón abrir:** Abre datos guardados previamente.
- **Botón guardar:** Guarda los datos modificados.
- **Días:** se puede desplazar entre los días pulsando a derecha o izquierda de la tabla.
- **Tiempo:** está conectado con las predicciones del [Aemet](http://www.aemet.es/es/eltiempo/prediccion/municipios/horas/viveiro-id27066) y pone en cada hora el tiempo que hará y la temperatura.
- **Bandas:** tocar en ellas lleva a la página de detalle de la banda. Las bandas tienen un código de colores:
    * Rojo-Amarillo-Verde - Relevancia de la banda de menor a mayor(ver Editar banda)
    * Morado - Sin identificar.
    * Azul - Preferencia de la banda (ver Editar banda) 

### Detalle de la banda

- **Nombre y relevancia:** El nombre y la relevancia que el usuario haya puesto a la banda.
- **Imágenes:** Las imágenes vienen de la [página de la banda](http://www.resurrectionfest.es/bands/) en la página del festival y de la página de Spotify de la banda. Ahora, hay bandas, como las del concurso de bandas que no tienen foto en la página del festival. Por otra parte, la búsqueda de bandas en spotify se hace por nombre y cogiendo el primer artista que encuentra, por lo que muchas imágenes de spotify que no se corresponden y hay bandas que directamente no tienen. Estoy buscando una solución a esto último.
- **Proveniencia:** Son datos que he buscado yo por internet. Algunas las sabía, otras no estoy seguro. En España he intentado acotar a la provincia.
- **Escenario, fecha y hora**
- **Cuenta atrás:** la cuenta atrás está en rojo hasta que empiece el concierto. Entonces se pone en negro y marca lo que le queda al concierto.
- **Género y popularidad:** También está sacado de Spotify, por lo que puede ser información errónea si el nombre lo encuentra mal.
- **Descripción:** La descripción que el usuario haya puesto a la banda.
- **Botón Editar:** Accede a la página para editar la información de la banda.

### Editar banda

- **Preferencia:** Si el usuario decide que quiere ver esa banda, destacándola en azul en el horario.
- **Procedencia:** Procedencia de la banda.
- **Relevancia:** Este campo está pensado para indicar la importancia que tiene la banda para el usuario, que se indicará con un código de colores en el horario.
- **Descripción:** Notas que se quieran apuntar sobre la banda. Yo lo uso para acordarme de quién era quién de los grupos que no conocía antes.

### Ahora

Esta sección muestra los conciertos que hay en ese momento con la cuenta atrás en negro indicando lo que le queda y los siguientes que van a suceder con la cuenta atrás en rojo a cuándo van a empezar.

### Buscar
Es un buscador de grupos por nombre. Al picar te lleva a la página del grupo.

## Información variada

Dejo por aquí mi [LinkedIn](https://www.linkedin.com/in/miguel-izquierdo-hidalgo-04950679/), [Instagram](https://www.instagram.com/michael_left90/) y [correo](mailto:miguel.izquierdo.hidalgo@gmail.com) por si alguien tiene alguna sugerencia que dudo que sea capaz de solucionar en lo que queda de tiempo.

Si te ha gustado la aplicación me puedes invitar a un café o media cerveza en el festival por [aquí](https://ko-fi.com/leftidos).