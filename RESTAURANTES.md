# MAROHE · Ruleta de Restaurantes

La búsqueda usa Google Places API (New). La ruleta gira sobre la lista que ya recibió el navegador: **cada giro no hace otra búsqueda**. No se ha enviado ninguna consulta facturable a Google durante la implementación; las comprobaciones utilizan respuestas de prueba.

## Si ves una lista de archivos o no aparecen restaurantes

Abre `restaurantes/index.html`, no solamente la carpeta `restaurantes`. Los enlaces del menú ya apuntan al archivo explícito para evitar que el navegador muestre un índice de carpeta.

Al abrir la web con doble clic, la dirección empieza por `file://`: puedes ver el diseño, pero las búsquedas necesitan el backend. En este modo, la página muestra una guía y desactiva ubicación, filtros y giros para evitar intentos que no pueden funcionar. Para conectar los datos reales:

1. Copia `.env.example` como `.env.local` en la carpeta principal y completa las dos claves distintas de Google indicadas abajo.
2. Abre `ABRIR-MAROHE.cmd` con Node.js 24 instalado y mantén abierta la ventana del servidor.
3. Entra a `http://127.0.0.1:4173/restaurantes/index.html`. Reinicia el servidor después de cambiar las claves.

Si abres la app desde HTTP y todavía falta una clave, la página también muestra los pasos de configuración. Que falte la clave pública del mapa no impide buscar por ubicación o zona cuando la clave privada de Places ya está configurada. No se muestran restaurantes ficticios.

## Configuración en Vercel

Habilita la facturación de Google Maps Platform y las APIs **Places API (New)** y **Maps JavaScript API** en Google Cloud. Usa dos claves distintas:

| Variable | Uso |
| --- | --- |
| `GOOGLE_MAPS_API_KEY` | Secreto del servidor. Restricción de API: Places API (New). Nunca se devuelve al navegador ni aparece en las URLs de fotos. |
| `GOOGLE_MAPS_BROWSER_KEY` | Clave pública independiente para Maps JavaScript API. Restringir por los dominios/referrers exactos de producción y de las previews que se quieran permitir. |
| `GOOGLE_MAPS_MAP_ID` | Opcional, ID del mapa de Google. |
| `RESTAURANT_PHOTO_SIGNING_SECRET` | Opcional, secreto aleatorio de al menos 32 caracteres. Firma las URLs temporales de las fotos. Si falta, se firma con la clave privada del servidor sin exponerla. |

Configura los secretos en Vercel → Settings → Environment Variables. Un cambio de variables requiere un despliegue para llegar al entorno que sirve la web. Publicar entradas del blog continúa siendo independiente de esto. En desarrollo, copia `.env.example` a `.env.local` y abre `ABRIR-MAROHE.cmd` o ejecuta `npm run dev` con Node.js 24. El servidor local incluido sí carga `.env.local` y sirve tanto la web como las funciones en `http://127.0.0.1:4173`. No hace falta instalar dependencias.

Si falta la clave de Places, la pantalla muestra que los restaurantes todavía no están conectados, con una lista vacía. No inventa restaurantes ni usa una lista de demostración como si fuera real. Si se repite la clave privada en la variable pública, `/api/maps-config` la rechaza y devuelve `browserKey:null`.

## Costos y topes

El crédito fijo de **USD 200 al mes terminó el 28 de febrero de 2025** y fue reemplazado por umbrales gratuitos por SKU. Los campos de rating, nivel de precio y apertura de esta función corresponden a **Nearby Search Enterprise**. En la tarifa global publicada consultada el 15/10/2026: 1,000 búsquedas mensuales gratuitas y luego USD 35 por 1,000 en el primer tramo. **Place Details Photos** tiene un umbral separado de 1,000 y luego USD 7 por 1,000 en su primer tramo. El mapa JavaScript puede generar cargos de su propio SKU. Las tarifas dependen de la cuenta, contrato, región y consumo de todas las aplicaciones del proyecto: [cambios de marzo de 2025](https://developers.google.com/maps/billing-and-pricing/faq), [precios vigentes de Google](https://developers.google.com/maps/billing-and-pricing/pricing).

Valores por defecto, modificables sin editar código:

| Variable | Predeterminado | Qué limita |
| --- | ---: | --- |
| `RESTAURANTS_ENABLED` | `true` | `false` apaga búsquedas y fotos de la aplicación. |
| `RESTAURANTS_REQUESTS_PER_10_MINUTES` | `20` | Solicitudes de búsqueda por IP anonimizada y bloque de 10 minutos. |
| `RESTAURANTS_PHOTOS_PER_10_MINUTES` | `30` | Solicitudes de foto por IP anonimizada y bloque de 10 minutos. |
| `RESTAURANTS_SEARCH_DAILY_LIMIT` | `100` | Intentos salientes de Nearby Search por día UTC. `0` impide llamadas. |
| `RESTAURANTS_SEARCH_MONTHLY_LIMIT` | `1000` | Intentos salientes de Nearby Search por mes UTC. |
| `RESTAURANTS_PHOTO_DAILY_LIMIT` | `100` | Intentos salientes de Place Photos por día UTC. |
| `RESTAURANTS_PHOTO_MONTHLY_LIMIT` | `1000` | Intentos salientes de Place Photos por mes UTC. |
| `RESTAURANTS_UPSTREAM_TIMEOUT_MS` | `8000` | Espera máxima de cada llamada externa, entre 1,000 y 15,000 ms. |

No hay reintentos automáticos facturables. Las cuotas se reservan antes de llamar a Google, incluso si Google acaba devolviendo error; el cómputo es conservador. La aplicación agrupa solicitudes simultáneas de la misma zona y categoría dentro de una instancia. Con Redis también toma un candado compartido para que otra instancia responda «consulta en curso» en lugar de repetir la llamada.

Para contadores compartidos entre instancias, configura `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`, ya usados por el blog. También se aceptan los alias `KV_REST_API_URL` y `KV_REST_API_TOKEN`. Se usan claves independientes `welcome-mate:restaurants:v1:*`, sin modificar el blog. Redis aplica de forma atómica los topes diario y mensual; si deja de responder, la búsqueda se detiene en lugar de saltarse los topes.

Sin Redis, hay un respaldo en memoria para desarrollo o una instancia caliente. **Estos contadores no son globales ni sobreviven al escalado, reinicio o despliegue. No garantizan un máximo en dólares en Vercel.** Incluso con Redis, los topes solo cuentan llamadas de estas funciones; no incluyen mapas del navegador ni otros consumidores del mismo proyecto. Establece además cuotas apropiadas en Google Cloud, restricciones de claves, alertas de presupuesto y supervisión de facturación. Las alertas de presupuesto no equivalen por sí solas a cortar todo el gasto: [cuotas de Places](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing), [gestión de costos](https://developers.google.com/maps/billing-and-pricing/manage-costs).

## Caché de zonas y la restricción de Google

No se habilitó una caché general de nombres, ratings, horarios y fotos por 24 horas por defecto. Las políticas normales de Places restringen almacenar ese contenido; los **place IDs** sí tienen una excepción. Las condiciones también contemplan una excepción específica para latitud/longitud, que no es permiso para conservar el resto de la ficha: [políticas de Places](https://developers.google.com/maps/documentation/places/web-service/policies), [condiciones específicas, sección 14](https://cloud.google.com/maps-platform/terms/maps-service-terms).

La configuración normal usa una clave de zona **geohash de precisión 7 + radio + tipo de Google** y guarda solamente una lista de IDs durante 24 horas. `PLACES_IDS_TTL_SECONDS=86400` ajusta ese plazo entre 60 y 2,592,000 segundos. Ese índice no permite reconstruir las fichas; por eso una nueva búsqueda obtiene los datos de nuevo. La lista que ya está abierta para jugar vive en memoria de la página. No se guarda contenido de Google en `localStorage` ni en el service worker.

Si un contrato o autorización aplicable permite una caché del contenido, existe el mecanismo solicitado:

```dotenv
# Activar únicamente con permiso aplicable confirmado.
PLACES_CACHE_CONTENT_ALLOWED=true
PLACES_CACHE_TTL_SECONDS=86400
```

El TTL del contenido admite 0–86,400 segundos. El valor `false` predeterminado ignora ese TTL y conserva solo IDs. `cache.mode` explica qué política se está aplicando (`place-ids-only` o `licensed-content`). En modo de IDs, `cache.hit` permanece `false` aunque `idsHit` sea `true`, porque no se ha servido una ficha almacenada. La caché licenciada omite siempre referencias y autores de fotos; una ficha reutilizada puede no tener foto.

Los datos «abierto ahora» de más de cinco minutos se devuelven como desconocidos; buscar específicamente abiertos fuerza una consulta reciente. Toda respuesta incluye `fetchedAt`. La caché licenciada no debe presentarse como garantía de que el local continúe abierto o conserve su rating.

## Contrato de las funciones

`GET /api/restaurants?lat=-12.121&lng=-77.03&radius=1000&openNow=false&minRating=4&price=1&type=restaurant`

- Coordenadas numéricas válidas. Radios: `500`, `1000`, `2000` metros.
- `openNow`: `true`/`false` o `1`/`0`; sin dato de apertura, el local queda fuera del filtro «abierto».
- `minRating`: `0`, `4`, `4.5`. Sin rating, el local queda fuera de un umbral mayor que cero.
- `price`: vacío o `1`, `2`, `3`. Es nivel de Google, **no un precio en soles**. Un nivel desconocido no pasa un filtro de precio.
- `type`: `restaurant`, `huarique`, `japanese`, `ceviche`, `cafe`, `chifa`.
- `refresh=1`: actualización explícita; evita la caché licenciada de contenido y mantiene todos los topes de consulta. No se usa al girar la ruleta.

Cada búsqueda saliente hace un único `POST https://places.googleapis.com/v1/places:searchNearby`, máximo 20 resultados, orden por distancia y máscara explícita de campos. No hay paginación oculta, Details adicionales ni Autocomplete. Para compartir zonas, el centro de Google es el centro de la celda geohash y se amplía el radio por el pequeño margen de la celda; después se calcula la distancia real al punto solicitado y se excluye todo lo que quede fuera del radio. Son hasta 20 candidatos cercanos, no una lista exhaustiva de todos los restaurantes del área. Aplicar muchos filtros puede dejar pocos resultados: [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search).

Las categorías `japanese`, `cafe`, `chifa` y `ceviche` usan respectivamente `japanese_restaurant`, `cafe`, `chinese_restaurant` y `seafood_restaurant`. Google no ofrece una categoría «huarique» en este endpoint: se buscan restaurantes y se filtran los económicos (nivel 0/1) o nombres con «huarique»/«picantería». Las categorías de chifa/ceviche son aproximaciones y la respuesta lo informa.

Respuesta:

```json
{
  "configured": true,
  "restaurants": [{
    "id": "PLACE_ID",
    "name": "Nombre proporcionado por Google",
    "rating": 4.5,
    "priceLevel": 1,
    "openNow": true,
    "distanceMeters": 240,
    "address": "Dirección proporcionada por Google",
    "latitude": -12.12,
    "longitude": -77.03,
    "mapsUrl": "https://maps.google.com/...",
    "photoUrl": "/api/restaurant-photo?token=TOKEN_FIRMADO",
    "photoAttributions": [{"displayName":"Autor","uri":"https://maps.google.com/...","photoUri":"https://lh3.googleusercontent.com/..."}],
    "photoMapsUrl": "https://www.google.com/maps/...",
    "placeAttributions": []
  }],
  "center": {"lat": -12.121, "lng": -77.03},
  "fetchedAt": "2026-10-15T12:00:00.000Z",
  "cache": {"hit":false,"mode":"place-ids-only","idsHit":false,"expiresAt":"2026-10-16T12:00:00.000Z","zone":"GEOHASH"},
  "limits": {"scope":"shared-redis"}
}
```

Rating, precio, apertura y foto pueden ser `null`. Los errores devuelven `message`, `error`, `code` y, para búsqueda, `restaurants:[]`. Validación: HTTP 400. Límite o consulta en curso: 429 y `Retry-After`. Fallo del proveedor: 502. Redis no disponible: 503. No se devuelve el cuerpo del error de Google ni los secretos.

`GET /api/maps-config` devuelve exclusivamente `configured`, la clave pública `browserKey`, `mapId` y un mensaje si falta configurar. Nunca usa la clave del servidor como alternativa pública.

`GET /api/restaurant-photo?token=...` acepta solamente tokens HMAC que creó una búsqueda reciente. No admite una URL ni una referencia arbitraria del cliente. El token dura 15 minutos y se permite un máximo de tres recuperaciones. Solo debe asignarse la foto al resultado ya elegido, nunca a cada frame de la ruleta. Las fotos no se precargan ni se almacenan en el servidor; Google puede caducar su referencia. La función oculta la clave, valida los hosts de imagen de Google, limita dimensiones/tamaño y devuelve `no-store`: [fotos de Places](https://developers.google.com/maps/documentation/places/web-service/place-photos).

Las fichas deben mostrar las atribuciones devueltas. El mapa asociado a contenido de Places debe ser de Google. Cuando se muestre la lista sin ese mapa, debe mantenerse la atribución de Google exigida por sus políticas. La web debe tener términos y privacidad públicos que expliquen la ubicación y enlacen a las condiciones/privacidad de Google.

## Comprobaciones sin gastar consultas

```powershell
node --test lib/restaurants/restaurants.test.js
```

Los tests sustituyen todas las llamadas externas. Cubren validación, distancias, límite de 20, campos facturables, filtros, agrupación concurrente, caché de solo IDs, caché de contenido por autorización, apertura caducada, topes, falta de claves, URLs de fotos firmadas, rechazo de hosts externos, atribuciones, separación de claves y caída de Redis sin saltarse cuotas. La conexión real a Google queda pendiente de configurar las dos claves y habilitar las APIs en la cuenta de la propietaria.
