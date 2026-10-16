# MAROHE WORLD · v5.60

El sitio incluye tu presentación de Marohe, el logo MAROHE, el home en el orden episodios → blog → tienda, Substack en https://substack.com/@marohe, el botón burbuja PLAY, Agencia en el menú y los retos en una pestaña independiente con portadas verticales. Se retiró la categoría de bobas preparadas. Kits conserva los cuatro kits de preparación, velas y pintura, y añade el set de **lanyard + bolsa** con la nueva foto; la bebida ilustrada no se incluye. Los personajes regionales son alpacas compactas en Cusco y Chan Chan, delfín rosado en Iquitos y vicuña en Arequipa.

La tienda ahora dice «De mi imaginación a tu casa» y el lema es «Jugar. Crear. Reír.». El botón de Play dice **VIDEOJUEGOS**. La pestaña **RULETAS**, junto a AR CITY, contiene **Ruleta de Pelis** y **Ruleta de Restaurantes · Próximamente**. Restaurantes ya no aparece como acceso directo en el menú principal. Las redes son Instagram `MISSMAROHE`, Facebook `missmarohe` y YouTube `@missmarohe`; los pedidos de la tienda abren ese nuevo Instagram.

## Ruleta de Pelis

Abre Play → Ruletas → Ruleta de Pelis. La app usa TMDB, muestra pósteres de su catálogo y permite elegir género, mood, año, duración y plataforma disponible en Perú. Guarda la lista por combinación de filtros en `localStorage`; los giros eligen de esa lista sin consultar la API. El tráiler y las opciones para verla se cargan al abrir la ficha con su botón.

Sin clave o al abrir el HTML directamente, **Girar funciona en un modo muestra identificado**, con 12 películas de la referencia, portadas ilustrativas y filtros locales. No presenta esas portadas como pósteres de TMDB ni inventa plataformas. Las plataformas y tráilers del catálogo se activan al conectar la API.

Para conectar películas reales, copia `.env.example` a `.env.local` y completa **solo `TMDB_API_KEY`** para esta función. Ejecuta `ABRIR-MAROHE.cmd` o `npm run dev` y abre `http://127.0.0.1:4173/peliculas/index.html`. No necesitas claves de Google para la ruleta de Pelis. Consulta [PELICULAS.md](PELICULAS.md) para la configuración, atribuciones y uso de la API. El archivo HTML de referencia se usó como inspiración visual; el código nuevo se integra con MAROHE.

## Abrir en tu computadora

Necesitas Node.js 24 o posterior. Abre `ABRIR-MAROHE.cmd` y entra en `http://127.0.0.1:4173`. También puedes ejecutar `npm run dev` desde esta carpeta. No hace falta instalar paquetes. Mantén el servidor abierto mientras utilizas la web.

La app de restaurantes se conserva en preparación en `http://127.0.0.1:4173/restaurantes/`. Su tarjeta en Play → Ruletas muestra **Próximamente** y no abre búsquedas. El mapa permite ubicación, pin movible y zonas sugeridas; los filtros incluyen radio, horario, rating, precio y tipo. El historial y las exclusiones guardan únicamente identificadores y decisiones del usuario en su navegador.

Si abres una de las apps como archivo local, muestra cómo iniciar el servidor. Para consultar datos reales, utiliza `ABRIR-MAROHE.cmd` y la dirección local indicada arriba; abrir solamente el HTML no ejecuta el backend.

## Conectar restaurantes reales

1. Copia `.env.example` a `.env.local`.
2. Configura `GOOGLE_MAPS_API_KEY` para Places API (New), solo en el servidor.
3. Configura otra clave, `GOOGLE_MAPS_BROWSER_KEY`, para Maps JavaScript API, restringida por tus dominios y referrers. Es una clave pública del mapa; no uses la misma clave privada.
4. Habilita ambas APIs y facturación en Google Cloud. Reinicia el servidor local después de editar las variables.

La app no muestra restaurantes inventados cuando faltan las claves. La conexión real queda pendiente de esa configuración. Para publicar en Vercel utiliza esta carpeta completa: los archivos de `api/` necesitan ejecutarse como funciones Node; un alojamiento de archivos estáticos por sí solo no ejecutará el buscador.

Cada búsqueda hace una sola llamada a Nearby Search, con un máximo de 20 candidatos. Girar vuelve a elegir de la lista que ya tiene la página; no repite esa búsqueda. Las fotos seleccionadas usan un endpoint separado y pueden generar su propio cargo. La búsqueda se actualiza al cambiar filtros, mover el centro más de 200 metros o pulsar Actualizar.

La caché completa de 24 horas se entrega como opción explícita para una licencia que permita almacenar ese contenido. La configuración predeterminada conserva solo IDs por zona, de acuerdo con las restricciones de Google. Google reemplazó el crédito fijo de USD 200 por cupos por servicio; los topes del servidor y las cuotas de Google se deben ajustar a tu cuenta. Consulta [RESTAURANTES.md](RESTAURANTES.md) para variables, límites, privacidad, caché, costes y fuentes oficiales.

## Blog y datos existentes

La publicación compartida del blog conserva la configuración anterior de Upstash Redis y contraseña de administrador. Publicar una entrada desde el dashboard no requiere otro deploy cuando ese servicio ya está configurado. El home muestra las tres entradas publicadas más recientes del mismo blog. Consulta [BLOG-VERCEL.md](BLOG-VERCEL.md).

Las claves de almacenamiento de juegos y blog se conservaron para mantener avances y entradas anteriores. No se incluye `.env.local` ni ninguna clave de Google en el paquete.

## Comprobaciones

`npm test` ejecuta pruebas de backend de restaurantes y películas con respuestas simuladas, sin consultas a los proveedores. También se comprobó en navegador el recorrido de la página a las funciones Node, filtros, giros locales, historial, avatares, navegación y anchuras móviles. Los datos reales requieren las claves de tu cuenta; no se realizaron consultas con una clave real durante esta implementación.

Los detalles de los recursos gráficos están en [IMAGENES-MAROHE.md](IMAGENES-MAROHE.md). `LEEME.md` conserva notas históricas de versiones anteriores.
