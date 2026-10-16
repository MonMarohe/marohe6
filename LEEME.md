# Welcome Mate

PWA en español con ocho juegos y dos retos dentro de Play. El inicio presenta la marca, la tienda y accesos a episodios, juegos y blog, sin mostrar los juegos allí. La tienda ofrece cuatro bobas y cuatro kits; las imágenes actuales incluyen taro con chicha y matcha con mate de coca. El blog tiene fondo oscuro, artículos, búsqueda, categorías y un dashboard con publicación compartida en Vercel al conectar Upstash Redis. No requiere instalación de paquetes ni una compilación.

## Abrir

En Windows, haz doble clic en `ABRIR-WELCOME-MATE.cmd` y abre el enlace que aparece. Deja esa ventana abierta mientras juegas. También puedes abrir `index.html` directamente para probar el juego, sin instalación ni modo sin conexión.

Sirve esta carpeta con un servidor HTTP. Por ejemplo: `python -m http.server 4173 --bind 127.0.0.1` y abre `http://127.0.0.1:4173`.

Para publicar los juegos, sirve el sitio desde HTTPS. Para activar el blog compartido en Vercel, sigue `BLOG-VERCEL.md` y despliega también la carpeta `api`. En la portada, «↓ Descargar PWA» solicita la instalación cuando el navegador ofrece esa función. Abrir el HTML con doble clic permite probarlo, pero no activa la instalación ni el modo sin conexión.

## Secciones

- **Inicio**: portada con el nuevo logo, tienda y accesos a episodios, juegos y blog.
- **Agency**: presentación breve de Claudia y del proyecto Welcome Mate, con infografía interactiva.
- **Bunny City**: el tablero de Lima sigue disponible por su enlace y desde el footer; ya no ocupa un lugar en el menú principal.
- **Tienda**: cuatro kits, cuatro bobas y ropa. Los kits y bobas se consultan por Instagram; los precios no confirmados aparecen como «Consultar precio». Desde bobas se puede ir a kits y viceversa. La ropa aparece como «Próximamente».
- **Play**: ocho videojuegos, dos retos de 20 preguntas, generador de memes y AR City. Se retiró Sticker Creator.
- **Episodios**: catálogo visual conectado al canal `https://www.youtube.com/@missmarohe`.
- **Blog**: buscador, filtros, lector completo y botones para compartir. «Admin», en el footer, abre el dashboard. Tras configurar Storage en Vercel, artículos y fotos se publican para todos los dispositivos. Antes de configurarlo, puedes preparar y respaldar copias locales. Consulta `BLOG-VERCEL.md` para activar el servicio e importar las entradas anteriores.

## Bunny City AR · Lima

Desde el enlace de Bunny City, abre el mapa y toca «Estoy aquí». Bunny City es un juego de landmarks y encuentros creativos en Lima. Empieza con Parque Kennedy, Huaca Pucllana y MALI; el Admin puede añadir otros lugares. Verás tu distancia en línea recta a cada punto publicado. La cámara se activa a 100 metros o menos, con una ubicación reciente y una precisión GPS de 100 metros o mejor. Si el GPS es impreciso, vuelve a solicitarlo.

La cámara trasera muestra un conejo blanco de bloques en 3D que salta, con una idea sobre arquitectura, ingeniería o diseño. «Encontré a Bunny» añade un sello al pasaporte y su bloque: Sombra, Quincha o Luz. Son recompensas simbólicas; Pucllana está construida con adobe. No se graban imágenes y la cámara se apaga al cerrar, cambiar de página o enviar la app al fondo. Es una superposición sobre la cámara, sin reconocimiento del monumento ni anclaje al suelo.

Mi Pasaporte funciona sin conexión tras la primera visita. Tus sellos se guardan en este navegador; no se guarda tu ubicación. Cusco, Tokyo y Copenhagen aparecen como próximos capítulos.

El mapa de calles usa MapLibre GL y OpenFreeMap (https://openfreemap.org/). Puedes arrastrarlo por Lima y fuera de ella, acercar o alejar, ampliar la vista y volver a «Ver toda Lima». Requiere conexión a internet y WebGL; si no carga, se muestra un aviso con opción de reintentar. Los landmarks, eventos y el pasaporte siguen disponibles sin el mapa. Se conserva la atribución cartográfica del proveedor.

La pestaña **Eventos** muestra encuentros publicados con fecha, horario y lugar. No se han añadido eventos reales de ejemplo. El sello de un evento solo se puede ganar durante su horario y estando cerca de su punto. Los horarios se introducen y muestran en hora de Lima (UTC−5). Los sellos no son entradas ni reservas. Los puntos de eventos se distinguen en morado; los encontrados, en verde. Los sellos ya ganados se conservan aunque después se retire un evento o landmark.

### Administrar landmarks y eventos

En el footer, «Bunny City» abre el dashboard con la misma sesión administrativa del blog. También puedes pasar entre ambos dashboards desde sus cabeceras. El formulario permite crear y editar lugares o eventos, guardar borradores, publicar, ocultar y retirar puntos. Para colocar un punto, toca «Elegir punto en el plano» y después su ubicación; también puedes introducir latitud y longitud o usar tu GPS. Revisa las coordenadas antes de guardar. Añade un nombre, lugar o dirección, mensaje de Bunny, recompensa y, opcionalmente, un enlace HTTPS de información. Los eventos necesitan hora de inicio y de fin.

Este tablero usa localStorage: los cambios solo aparecen en el navegador donde se guardaron y pueden utilizarse sin conexión después de cargar la PWA. No se sincronizan entre visitantes o dispositivos. La contraseña local es una barrera de interfaz; la publicación compartida con permisos reales necesita almacenamiento y autenticación de servidor.

Las tarjetas ahora ofrecen «Activar ubicación» o «Actualizar ubicación», en lugar de un botón bloqueado. «Ver a Bunny · vista previa» funciona desde cualquier lugar, sin abrir la cámara ni ganar sellos. Solo el encuentro cercano con cámara añade la recompensa al pasaporte.

Para usar cámara y ubicación en un teléfono, abre la PWA en HTTPS. Una dirección HTTP de la red local no sirve como contexto seguro. Las pruebas en computadora pueden usar localhost. Esta versión aún necesita una prueba real en móvil, en los tres lugares, para comprobar los permisos y la precisión del GPS.

## Juegos

### Fuel Bunny · La Ciudad de las Mil Ideas

Juego de plataformas en siete barrios. Mueve a Bunny con ← → o A/D; salta con ↑, W o espacio. Acércate a un puente transparente y pulsa B o «Construir» para colocar cubos. En los lugares marcados, pulsa T o «Plantar» para crear un árbol que calme a las bombas de ruido cercanas. P pausa. Reúne chispas, construye puentes, planta refugios y alcanza el fuego: representa la pasión que mantiene vivos los proyectos creativos.

### Escape Bunny

Recoge todas las chispas y llega al fuego. Usa flechas, WASD, botones táctiles o desliza sobre el tablero. Empuja cubos para abrir caminos y planta árboles de límites frente a las bombas del ruido. Hay tres vidas y tres árboles por mundo.

### City Bunny

Juego de vuelo lateral entre edificios. Toca el tablero, pulsa espacio o flecha arriba para impulsarte. La boba negra suma puntos; la roja es un obstáculo. Chocar con la boba roja, los edificios o los límites termina la partida.

### Block Bunny

Encaja bloques que caen en un tablero de 10 × 20. Completa filas para sumar puntos y construir una ciudad de posibilidades. Flechas izquierda y derecha mueven, arriba gira, abajo baja y espacio suelta.

### Boba Bunny

Intercambia fichas vecinas en un tablero de 8 × 8. Combina tres o más diamantes, bobas o conejos iguales. Las fichas eliminadas dejan huecos y las de arriba caen verticalmente conservando su orden; después entran fichas nuevas desde arriba, como en un match-3 clásico.

## Recursos visuales

Las portadas están en `assets/fuel-bunny.png`, `assets/escape-bunny-v3.png`, `assets/city-bunny-v3.png`, `assets/block-bunny.png` y `assets/boba-bunny.png`. El primer episodio conceptual de Lima está en `assets/episodio-lima.png`. Las fotos de tienda recientes son `assets/about-hoodie-aprende.jpg`, `assets/club-poli-shirt.jpg`, `assets/fundamentos-amor-propio.jpg` y `assets/claudia-wonka.jpg`, junto con los kits y bebidas anteriores.

## Alcance actual

El blog admite publicación compartida y autenticación del servidor al conectar Storage en Vercel: consulta BLOG-VERCEL.md. El tablero de Bunny City conserva sus datos locales.

Los formularios, preferencias y avances se guardan localmente en el dispositivo. La tienda no procesa pagos ni inventario: los botones de pedido abren Instagram para coordinar la compra. El canal de YouTube, Substack, Instagram y Facebook necesitan conexión a internet. La PWA guarda sus archivos para uso sin conexión después de la primera carga; la instalación depende del navegador y requiere HTTPS o localhost.


## Actualización v5-19

Landmarks y eventos comparten una misma vista: la agenda aparece debajo de los landmarks. El Admin permite subir una foto JPG, PNG o WebP de hasta 8 MB, revisar su vista previa y quitarla antes de guardar. La foto se comprime y se guarda con el punto en este navegador. El botón de Bunny en Lima usa rosado intenso. Las pruebas de lógica, formularios y navegación pasan en emulación DOM; la carga visual de cartografía y WebGL no fue comprobada en un navegador real.


## Actualización v5-20

La librería MapLibre, su worker, estilos y licencia se incluyen en vendor/maplibre y en la caché de la PWA. El mapa se muestra al cargar su estilo, sin esperar que terminen todas las descargas. Un error recuperable de calles o tipografías ya no destruye el mapa. Los fallos de inicio permiten reintentar; las respuestas de una carga anterior no vuelven a abrir un mapa descartado. Las calles requieren conexión. Se comprobó la importación del módulo real, la respuesta del proveedor y las pruebas de lógica; el renderizado WebGL en el navegador del usuario sigue pendiente.



## Actualización v5-21

Bunny City usa Leaflet 1.9.4 incluido en la PWA y calles raster de TomTom con la clave facilitada por Claudia. El mapa funciona sin WebGL, se puede desplazar y muestra landmarks y eventos juntos. La llamada autenticada para una imagen de Lima devolvió 200 image/png. La clave está en map-config.js, un archivo del cliente; para un sitio público configura sus restricciones de dominio en tu cuenta de TomTom. Las calles requieren conexión y no se guardan en la caché de la PWA.

Events usa fondo oscuro, tarjetas con fotos y acentos rosados y turquesa. Agency sustituye About en el menú y presenta kits, videojuegos, comida creativa, ropa y experiencias para marcas, negocios y eventos; el combinador muestra seis propuestas de servicios. Se conserva la introducción breve de Claudia. Las pruebas DOM de mapa, reintento, navegación, eventos, fotos y Agency pasan; el renderizado real en el navegador queda pendiente.



## Actualización v5-22

Los marcadores del mapa usan una caja de 42 px y ajustan la imagen de Bunny dentro del círculo. Se quitó el botón flotante de Bunny City. La pestaña Events conserva el mapa de landmarks y la agenda en la misma página. Se retiraron del About las secciones «La tienda también es parte del juego» y «La ciudad también es tu taller». Los artículos del blog ahora caben dentro de un lector desplazable para leer también el cuerpo completo. Pulí el marco visual, la cuadrícula, el HUD y los controles de los juegos.


## Actualización v5-27

Los cinco juegos usan toda la altura visible en celular, ocultan los bloques explicativos y conservan salida, pausa, puntuación y controles táctiles. Escape adapta el laberinto a vertical; Fuel y City ajustan la cámara a la relación de aspecto. En escritorio se mantiene el catálogo y las guías. El blog incluye una API de Vercel con Upstash Redis, fotos compartidas, protección de administrador, respaldo/importación de entradas locales y actualización del feed sin caché. Falta conectar Storage en el proyecto de producción una sola vez; instrucciones completas en BLOG-VERCEL.md.


## Actualización v5-28

Orden: City Bunny, Fuel Bunny, Boba Bunny, Block Bunny y Escape Bunny. Las chispas de Escape son más grandes, doradas y tienen un fondo morado para distinguirlas en el celular. Un toque en los controles de dirección mueve una casilla; mantener pulsado comienza a repetir después de una breve espera. Se evita el doble movimiento del clic que puede generar el navegador al soltar el dedo. Los botones izquierda y derecha de Block están juntos. Se corrigió el contraste del enlace de salida y el HUD en celular.


## Actualización v5-29

Australia Bunny estrena el catálogo. Combate arcade original en tres zonas de selva australiana: Bunny dispara chispas a serpientes, recoge corazones y recupera vida al encontrar koalas y canguros. La llama se activa al reunir los corazones y despejar las serpientes; llegar a ella abre la siguiente zona y al final gana la expedición. Controles de teclado/mouse y palanca táctil con botón de disparo y ayuda de puntería en celular; radar, pausa, sonido opcional, récord y llama guardados en el dispositivo. Compatible con la PWA sin conexión una vez cargada. El catálogo tiene cuatro portadas por fila en escritorio y dos en celular: Australia, City, Fuel, Boba / Block, Escape.


## Actualización v5-30

Perú Bunny añade una expedición arcade por tres zonas inspiradas en patios, corredores y frisos de adobe de Chan Chan. Los enemigos son arañas; las llamas amigas recuperan vida. Recoge corazones, vence a las arañas y llega al fuego para avanzar. Los muros bloquean movimiento y proyectiles; el radar ayuda a encontrar puertas y objetivos. Cámara adaptable a vertical y horizontal, palanca táctil, disparos asistidos, pausa, sonido opcional y progreso local independiente de Australia. El juego está incluido en la caché offline de la PWA. Referencia visual: [UNESCO / Chan Chan](https://whc.unesco.org/en/list/366).

Catálogo en escritorio: Australia, Perú, City y Fuel / Boba, Block y Escape; cuatro por fila. En celular son dos portadas por fila.


## Actualización v5-31

USA Bunny añade una campaña de tres zonas en un cañón con águilas enemigas y osos aliados que dan vida. Recoge corazones, lanza chispas y consigue el fuego. Las rocas bloquean el paso y los disparos, mientras las águilas pueden sobrevolarlas. Cámara adaptable a celular vertical u horizontal, palanca táctil, disparo asistido, radar, pausa y récord local independiente. Incluido en la caché offline de la PWA.

Catálogo: Australia, Perú, USA y City / Fuel, Boba, Block y Escape. Cuatro portadas por fila en escritorio; dos en celular. Perú conserva sus llamas amigas, arañas y patios de adobe.
