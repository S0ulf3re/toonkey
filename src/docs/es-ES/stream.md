# API de Streaming

Usando la API de streaming, se puede recibir en tiempo real toda clase de información (por ejemplo, los posts nuevos que pasaron por la linea de tiempo, los mensajes recibidos, las notificaciones de seguimiento, etc.) y manejar varias operaciones en estas.

## Conectarse a streams

Para usar la API de streaming, primero hay que conectar un **websocket** al servidor de Misskey

Conecte el websocket a la URL mencionada abajo, incluyendo la información de autenticación en el parámetro `i`Ej:
```
%WS_URL%/streaming?i=xxxxxxxxxxxxxxx
```

La información de autenticación hace referencia a tu propia clave de la API, o al token de acceso del usuario cuando se conecta al stream desde la aplicación

<div class="ui info">
    <p><i class="fas fa-info-circle"></i> Para obtener la información de la autenticación, consulte <a href="./api">Este documento</a></p>
</div>

---

La información de autenticación puede omitirse, pero en ese caso de uso sin un login, se restringirá la información que puede ser recibida y las operaciones posibles,Ej:

```
%WS_URL%/streaming
```

---

Al conectarse al stream, se pueden ejecutar las operaciones de la API mencionadas abajo y la suscripción de posts. Sin embargo en esta fase, todavía no es posible recibir los posts nuevos llegando a la linea de tiempo. Para hacer eso, es necesario conectarse a los **canales** mencionados más abajo.

**Todos los envíos y recibimientos de información con el stream son JSONs**

## Canales
En la API de streaming de Misskey, hay un concepto llamado "canal". Es una estructura para separar la información enviada y recibida. Solo con conectarse al stream de Misskey, aún no es posible recibir los posts de la linea de tiempo en tiempo real. Al conectarse al canal en el stream, se puede enviar y recibir variada información relacionada a los canales.

### Conectarse a canales
Para conectarse a los canales, hay que enviar al stream en formato JSON los siguientes datos.

```json
{
    type: 'connect',
    body: {
        channel: 'xxxxxxxx',
        id: 'foobar',
        params: {
            ...
        }
    }
}
```

Aquí
* En `channel` ingrese el nombre del canal al que quiere conectarse. Más abajo se menciona una lista de canales.
* En `id` ingrese un ID al azar para el intercambio de información con aquel canal. Como en el stream pasan varios mensajes, es necesario identificar de qué canales son esos mensajes. Este ID puede ser un UUID o un número al azar.
* `params` son los parámetros para conectarse al canal. Los parámetros requeridos al momento de conectarse varían según el canal. Si se conecta a un canal que no requiere parámetros, esta propiedad puede omitirse.

<div class="ui info">
    <p><i class="fas fa-info-circle"></i> El ID no es por canal sino "por conexión al canal". Porque hay casos en que se pueden hacer múltiples conexiones con parámetros distintos al mismo canal. </p>
</div>

### Recibir mensajes del canal
Por ejemplo, cuando hay nuevos posts en el canal, envía un mensaje. Al recibir ese mensaje, se puede conocer en tiempo real que hay nuevos posts en la linea de tiempo.

Cuando el canal envía un mensaje, se envía al stream en formato JSON los siguientes datos.
```json
{
    type: 'channel',
    body: {
        id: 'foobar',
        type: 'something',
        body: {
            some: 'thing'
        }
    }
}
```

Aquí
* En `id` se incluye el ID usado para conectarse al canal mencionado más arriba. Con esto se puede conocer a qué canales pertenecen los mensajes.
* En `type` se incluye el tipo del mensaje. Dependiendo del canal, varía qué tipo de mensajes pasan.
* En `body` se incluye el contenido del mensaje. Dependiendo del canal, varía qué contenido de mensajes pasan.

### Enviar mensajes al canal
Dependiendo del canal, se puede no solo recibir mensajes, sino también mandar mensajes a dicho canal, y realizar algunas operaciones.

Para mandar un mensaje al canal, se envía al stream en formato JSON los siguientes datos.
```json
{
    type: 'channel',
    body: {
        id: 'foobar',
        type: 'something',
        body: {
            some: 'thing'
        }
    }
}
```

Aquí
* En `id` ingrese el ID usado para conectarse al canal mencionado más arriba. Con esto se puede identificar a qué canales fueron dirigidos los mensajes.
* En `type` ingrese el tipo del mensaje. Dependiendo del canal, varía qué tipo de mensajes serán aceptados.
* En `body` ingrese el contenido del mensaje. Dependiendo del canal, varía qué contenidos de mensajes serán aceptados.

### Desconectarse del canal
Para desconectarse de un canal, se envía al stream en formato JSON los siguientes datos.

```json
{
    type: 'disconnect',
    body: {
        id: 'foobar'
    }
}
```

Aquí
* En `id` ingrese el ID usado para conectarse al canal mencionado más arriba.

## Hacer pedidos a la API a través del stream

Al hacer pedidos a la API a través del stream, se puede usar la API sin que se genere un pedido HTTP. Para eso, probablemente se pueda hacer el código más conciso y mejorar el rendimiento.

Para hacer pedidos a la API a través del stream, se envía al stream en formato JSON los siguientes datos.
```json
{
    type: 'api',
    body: {
        id: 'xxxxxxxxxxxxxxxx',
        endpoint: 'notes/create',
        data: {
            text: 'yee haw!'
        }
    }
}
```

Aquí
* En `id` se requiere ingresar un ID único por cada pedido a la API, para distinguir las respuestas de la API. Puede ser un UUID o un número aleatorio.
* En `endpoint` ingrese el endpoint de la API a la que quiere hacer el pedido.
* En `data` incluya los parámetros del endpoint 

<div class="ui info">
    <p><i class="fas fa-info-circle"></i> En cuanto a los endpoint de la API y los parámetros, consulte las referencias de la API.</p>
</div>

### Recibiendo respuestas

Al hacer un pedido a la API, llegará desde el stream una respuesta en el siguiente formato.

```json
{
    type: 'api:xxxxxxxxxxxxxxxx',
    body: {
        ...
    }
}
```

Aquí
* En la porción que dice `xxxxxxxxxxxxxxxx` viene el `id` ingresado en el momento de hacer el pedido. Con esto, se puede distinguir a qué pedido corresponde la respuesta.
* En `body` vienen los datos de la respuesta.

## Captura de posts

Misskey ofrece una construcción llamada "captura de posts". Es una función para recibir en el stream los eventos de un post seleccionado.

Por ejemplo, supongamos que se obtiene la linea de tiempo y se la muestra al usuario. Y ahí, supongamos que alguien reaccionó a un post incluido en esa linea de tiempo.

Sin embargo, como desde el cliente no hay forma de conocer las reacciones añadidas a cierto post, las reacciones no pueden reflejarse en el post en la linea de tiempo en tiempo real.

Para solucionar este problema, Misskey prepara un mecanismo de captura de posts. Cuando se captura un post, se pueden reflejar las reacciones en tiempo real para poder recibir los eventos relacionados al post.

### Capturar posts

Para capturar posts, se envía al stream el siguiente mensaje.

```json
{
    type: 'subNote',
    body: {
        id: 'xxxxxxxxxxxxxxxx'
    }
}
```

Aquí
* En `id` ingrese el `id` del post que se desea capturar.

Al enviarse el mensaje, se convierte en un pedido de captura a Misskey. Luego, los eventos relacionados a ese post serán emitidos.

Por ejemplo, suponiendo que se reacciona a un post, se emite el siguiente mensaje:

```json
{
    type: 'noteUpdated',
    body: {
        id: 'xxxxxxxxxxxxxxxx',
        type: 'reacted',
        body: {
            reaction: 'like',
            userId: 'yyyyyyyyyyyyyyyy'
        }
    }
}
```

Aquí
* En el `id` dentro del `body`, viene el ID del post que causó el evento.
* En el `type` dentro del `body`, viene el tipo del evento.
* En el `body` dentro del `body`, vienen los detalles del evento.

#### Tipos de eventos

##### `reacted`
Ocurre cuando se añade una reacción a un post.

* En `reaction` viene el tipo de reacción.
* En `userId` viene el ID del usuario que hizo la reacción.

Ej:
```json
{
    type: 'noteUpdated',
    body: {
        id: 'xxxxxxxxxxxxxxxx',
        type: 'reacted',
        body: {
            reaction: 'like',
            userId: 'yyyyyyyyyyyyyyyy'
        }
    }
}
```

##### `deleted`
Ocurre cuando ese post fue eliminado.

* En `deletedAt` viene la fecha y hora en que fue eliminado.

Ej:
```json
{
    type: 'noteUpdated',
    body: {
        id: 'xxxxxxxxxxxxxxxx',
        type: 'deleted',
        body: {
            deletedAt: '2018-10-22T02:17:09.703Z'
        }
    }
}
```

##### `pollVoted`
Ocurre cuando se hizo un voto a una encuesta incluida en el post.

* En `choice` viene el ID de la opción elegida.
* En `userId` viene el ID del usuario que hizo el voto.

Ej:
```json
{
    type: 'noteUpdated',
    body: {
        id: 'xxxxxxxxxxxxxxxx',
        type: 'pollVoted',
        body: {
            choice: 2,
            userId: 'yyyyyyyyyyyyyyyy'
        }
    }
}
```

### Cancelar la captura del post

Cuando el post ya no sea mostrado en pantalla y ya no sea necesario recibir los eventos relacionados a este, pida cancelar la captura.

Envíe el siguiente mensaje:

```json
{
    type: 'unsubNote',
    body: {
        id: 'xxxxxxxxxxxxxxxx'
    }
}
```

Aquí
* En `id` ingrese el `id` del post que se desea dejar de capturar.

Al mandar este mensaje, ya no se emitirán los eventos relacionados a dicho post.

# Lista de canales
## `main`
Se emite la información básica relacionada a la cuenta. Este canal no tiene parámetros.

### Lista de eventos emitidos

#### `renote`
Un evento que ocurre cuando un post propio es renotado. No ocurre cuando uno mismo renota el post.

#### `mention`
Un evento que ocurre cuando alguien te menciona.

#### `readAllNotifications`
Un evento que ocurre cuando todas tus notificaciones fueron marcadas como leídas. Se espera que se use el evento en casos como apagar el indicador que muestra si se tienen notificaciones sin leer.

#### `meUpdated`
Un evento que ocurre cuando tu información de perfil es actualizada.

#### `follow`
Un evento que ocurre cuando tú sigues a alguien.

#### `unfollow`
Un evento que ocurre cuando dejas de seguir a alguien.

#### `followed`
Un evento que ocurre cuando alguien te sigue.

## `homeTimeline`
Se emite la información subida a la linea de tiempo del inicio. Este canal no tiene parámetros.

### Lista de eventos emitidos

#### `note`
Un evento que ocurre cuando se emite un nuevo post en la linea de tiempo.

## `localTimeline`
Se emite la información subida a la linea de tiempo local. Este canal no tiene parámetros.

### Lista de eventos emitidos

#### `note`
Un evento que ocurre cuando se emite un nuevo post en la linea de tiempo local.

## `hybridTimeline`
Se emite la información subida a la linea de tiempo social. Este canal no tiene parámetros.

### Lista de eventos emitidos

#### `note`
Un evento que ocurre cuando se emite un nuevo post en la linea de tiempo social.

## `globalTimeline`
Se emite la información subida a la linea de tiempo global. Este canal no tiene parámetros.

### Lista de eventos emitidos

#### `note`
Un evento que ocurre cuando se emite un nuevo post en la linea de tiempo global.
