# MAROHE · Ruleta de Pelis

Entra en **Play → Ruletas → Ruleta de Pelis**. La estética adapta tu referencia: letras y botón de colores, flores, bordes negros, tres carretes verticales, ficha de resultado e historial, con el fondo oscuro de MAROHE.

## Probar el botón ahora

Puedes abrir `peliculas/index.html` con doble clic. **Girar funciona en modo muestra**, identificado en la página, con 12 títulos de la referencia y portadas ilustrativas hechas en código. Género, mood, año y duración filtran esa selección local. No se inventa disponibilidad en plataformas, pósteres reales ni tráilers. La ficha permite buscar el título en JustWatch.

## Conectar el catálogo de TMDB

1. Obtén tu **API key v3** en tu cuenta de [TMDB](https://www.themoviedb.org/settings/api).
2. Crea `.env.local` en la carpeta principal de MAROHE. Para Pelis basta esta línea:

```dotenv
TMDB_API_KEY=tu_clave_v3
```

3. Abre `ABRIR-MAROHE.cmd` con Node.js 24 o ejecuta `npm run dev`. Mantén abierto el servidor.
4. Entra en `http://127.0.0.1:4173/peliculas/index.html`. Reinicia el servidor si modificas la clave. Al publicar en Vercel, configura esa misma variable de servidor y despliega la carpeta completa, incluyendo `api/` y `lib/`.

No necesitas Google, Redis ni otra variable para ejecutar el código de Pelis. La obtención y autorización de uso de la clave dependen de tu cuenta y de las condiciones de TMDB; no se ha incluido una clave en el paquete. El HTML por sí solo permite el modo muestra, y el catálogo de TMDB necesita el backend.

## Datos y filtros

- `/api/movies` llama una vez a `/discover/movie`, hasta 20 títulos, en español y con región Perú. Filtra género, mood, año, duración y plataforma. El año final no puede superar el actual. Cortita: menos de 90 minutos; tranqui: de 90 a 120; larga: más de 120.
- Los moods agrupan géneros: reír → comedia; llorar → romance/drama; gritar → terror; aventura → aventura/acción; pensar → ciencia ficción/misterio; cozy → animación/familiar/fantasía. Si eliges género y mood, la consulta usa el género y se filtra la intersección por los géneros devueltos; una combinación puede quedar vacía.
- `/api/movie-platforms` consulta las plataformas de TMDB para Perú y las conserva 24 horas.
- `/api/movie-details?id=…` reúne ficha, vídeos y plataformas con `append_to_response`. Prefiere tráileres oficiales en español, con alternativas en inglés. Puede no haber un tráiler. La ficha muestra proveedores en Perú atribuidos a JustWatch; «Ver en JustWatch» busca el título, sin garantizar una reproducción o una suscripción.

La clave solo se envía de servidor a TMDB y no se devuelve al navegador. Los pósteres del catálogo se cargan desde `image.tmdb.org`. YouTube y JustWatch se abren en otra pestaña cuando eliges sus enlaces.

## Giros, caché y límites

**Girar no hace solicitudes API.** Cada giro elige aleatoriamente de la lista descargada. Las imágenes pueden descargarse desde la CDN de TMDB al mostrarse; eso no es una nueva búsqueda. «Ver tráiler y dónde verla» consulta una ficha solo cuando la abres y aún no está guardada.

`localStorage` guarda listas por filtros y fichas durante 24 horas, con un máximo de 16 entradas de caché. El historial conserva los últimos 12 títulos y puede borrarse. Si el navegador bloquea el almacenamiento, los giros siguen funcionando en memoria durante la visita. «Actualizar» solicita de nuevo la lista; cambiar filtros usa la lista guardada si sigue vigente. El servidor también conserva respuestas hasta 24 horas y agrupa búsquedas simultáneas.

Se añadió un tope conservador propio de **1,000 consultas salientes al día UTC por instancia** y 60 peticiones por origen de red cada 10 minutos; no es una cuota oficial garantizada de TMDB y se reinicia al reiniciar esa instancia. TMDB publica límites de protección variables y puede responder 429; la app muestra el error sin reintentos automáticos. [Límites oficiales](https://developer.themoviedb.org/docs/rate-limiting).

La API de desarrollador es gratuita para **uso no comercial**, con atribución. Para un uso comercial corresponde consultar la licencia de TMDB, especialmente si se integra en un sitio que vende productos. Se incluyen el logo aprobado, la declaración de no certificación y los créditos de TMDB/JustWatch. [Condiciones y atribución](https://developer.themoviedb.org/docs/faq), [logos oficiales](https://www.themoviedb.org/about/logos-attribution), [Discover](https://developer.themoviedb.org/reference/discover-movie), [proveedores de películas](https://developer.themoviedb.org/reference/movie-watch-providers).

## Verificación

`npm test` incluye pruebas de validación, filtros, región, caché, consultas simultáneas, fichas, enlaces, errores, topes y clave privada, con respuestas simuladas. La verificación de navegador prueba los botones, giros sin API, caché tras recargar, modo muestra, filtros y diseño móvil. No se hicieron consultas usando una clave real de TMDB.
