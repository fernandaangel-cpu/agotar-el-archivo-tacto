# Agotar el archivo — El contacto

**Fernanda Angel · DPPI 2026 · T07 Tacto · Proyecto individual**

> Hay palabras que se pierden cuando intentas retenerlas.


## 1. Concepto

Agotar el archivo propone una lectura que depende del contacto. Tres cartas recuperadas del persa, fechadas en 1985, 1986 y 1987, permanecen parcialmente borrosas hasta que alguien apoya un dedo sobre su escritura desde el teléfono. El contacto permite acceder a las palabras; sostenerlo demasiado en el mismo lugar empieza a deformarlas.

No intento reconstruir la intimidad completa de quienes escribieron ni simular el deterioro físico del papel. Pongo en tensión el deseo de comprender y la exigencia de volver completamente transparente un documento ajeno. El dedo funciona como una forma de atención: abre un lugar de lectura, pero también encuentra un límite. Soltar permite que el documento vuelva a su estado inicial.

La propuesta dialoga con **Maurice Blanchot, «La mirada de Orfeo», en El espacio literario**. En su lectura del mito, el deseo de ver y poseer a Eurídice conduce a su pérdida; la impaciencia busca agotar aquello que no puede concluirse. Mi traducción al diseño es esta paradoja entre aproximarse y perder de vista.

Referencia consultada: Blanchot, Maurice. «Orpheus’s Gaze», en *The Space of Literature*, fragmento, pp. 171–173. [Texto consultado en inglés](https://underworldsblog.wordpress.com/wp-content/uploads/2016/08/orpheuss-gaze1.pdf).

**Dimensión sonora:** el proyecto reutiliza las diez muestras sintetizadas de T06. No son grabaciones humanas ni lectura de lo escrito: son fragmentos semejantes a fonemas. El contacto vuelve perceptible una resonancia; la insistencia altera simultáneamente la legibilidad y el timbre.

## 2. Funcionamiento

### Cómo entrar

1. Abre la plataforma publicada en el computador, elige una carta y una página y pulsa **Activar sonido**. El navegador requiere ese clic para permitir audio.
2. Espera el mensaje «MQTT conectado».
3. Escanea el QR con la cámara normal del teléfono y abre el enlace en su navegador.
4. Comprueba que aparece la misma carta y que el computador indica «TELÉFONO CONECTADO».
5. Apoya el dedo sobre la escritura; espera para aclararla, desliza para recorrer y permanece para deformar.
6. Suelta para recuperar la borrosidad inicial. Cambia los ajustes si necesitas otra duración o tamaño.

No exige cuenta ni instalación. Los dos dispositivos necesitan internet y deben mantener abiertas sus páginas; no necesitan estar en la misma red. La opción «Probar con el ratón» es una prueba local y no acredita la conexión MQTT.

### Tabla de conexiones

| Dato o gesto | Variable visual | Regla y sentido |
| --- | --- | --- |
| Posición X/Y del dedo | Centro de la zona legible | Coordenadas normalizadas 0–1 sobre la imagen; el teléfono y el computador mantienen la proporción de la misma página. |
| Primeros 0,6 segundos de contacto | Aparición progresiva de la nitidez | La lectura exige una breve permanencia. |
| Permanencia dentro de una pequeña zona | Desplazamiento de franjas de escritura | Tras el umbral elegido, entre 1 y 8 s, crece la distorsión durante 3 s. No es presión física. |
| Deslizamiento | Nuevo lugar de lectura | Al alejarse del punto inicial se reinicia el tiempo de insistencia. Los pequeños temblores se toleran. |
| Posición del contacto en una cuadrícula invisible 5 × 2 | Selección de una de diez muestras y posición estéreo | Cada casilla corresponde a un sonido; X desplaza el sonido entre izquierda y derecha. No se reconocen palabras ni emociones. |
| Permanencia después del umbral | Timbre, altura y eco | En 3 s crecen la saturación y la oscilación del tono, baja la altura media, se cierra el filtro y aumenta el eco corto. El volumen no crece con la insistencia. |
| Hasta cinco dedos | Hasta cinco zonas locales | Cada contacto mantiene su propio tiempo; permite comparar palabras o lugares de la página. |
| Soltar el contacto | Desaparición de la intervención | Recuperación gradual en aproximadamente 0,65 s; el archivo original no cambia. |
| Pérdida de conexión o señal táctil | Liberación de los contactos | Evita dejar una deformación o un sonido activos por una desconexión. |

Ajustes: borrosidad inicial de 2–14 px sobre el lienzo de trabajo; tiempo previo a deformación de 1–8 s; radio del contacto de 4–22 % del ancho del documento. 
### Conexión MQTT

Implementación propia de páginas estáticas, tomando como referencia la arquitectura de [Tacto, de Felipe Roar](https://github.com/fefeliperoar/tacto). Utiliza mqtt.js y el mismo broker público propuesto por esa base: `wss://broker.emqx.io:8084/mqtt`.

El computador genera una sala aleatoria de 24 caracteres hexadecimales y un enlace de teléfono con esa sala. Ambos se suscriben a `agotar-tacto/<sala>/…`. El computador publica la selección de página y los ajustes en `state`; el teléfono publica coordenadas, identificadores de contacto y secuencia en `touch`. Hay avisos de presencia y desconexión y un latido de 0,5 s. Una revisión de estado permite descartar contactos retrasados de una página anterior. 
El broker recibe únicamente datos de interacción y el identificador de carta/página. No recibe imágenes, cámara, audio ni texto de las cartas. Las muestras se reproducen localmente en el computador; el teléfono funciona como control y no duplica la salida sonora. 
### Archivo y autorías

| Recurso | Origen y autoría | Condiciones |
| --- | --- | --- |
| Cartas de 1985–1987 y sus sobres | Documentos recuperados del persa ; la correspondencia identifica a María Elena y contiene también escritura de Carolina. Digitalizaciones reutilizadas del proyecto anterior. | . No se declara una licencia libre sobre las cartas. |
| Código de interacción, composición y documentación | Desarrollo para este proyecto con asistencia de ChatGPT/Codex. | Se entrega el código fuente para revisión académica. |
| Referencia de conexión | Tacto, repositorio de Felipe Roa. | Arquitectura de referencia; no se reutiliza su interfaz. |
| Cliente MQTT | MQTT.js, copia del cliente distribuido en Tacto. | Licencia MIT; ver `vendor/MQTT-LICENSE.txt`. |
| Generador QR | qrcode-generator 1.4.4, Kazuhiko Arase. | Licencia MIT; ver `vendor/QR-LICENSE.txt`. |
| Tipografías | Instrument Serif, DM Sans y DM Mono, distribuidas por Google Fonts. | SIL Open Font License; carga remota, con alternativas locales si falla la red. |
| Sonidos | Diez muestras originales sintetizadas por código para T06 con asistencia de IA; sin voz humana. | CC0-1.0, según el manifiesto original reutilizado. Ver tabla siguiente. |

### Banco sonoro 

| Archivo | Nombre | Duración | Autoría/origen | Licencia |
| --- | --- | --- | --- | --- |
| `audio/a.wav` | Apertura | 2.2 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/e.wav` | Claridad | 2.1 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/i.wav` | Hilo | 2.0 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/o.wav` | Cavidad | 2.4 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/u.wav` | Profundidad | 2.6 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/m.wav` | Murmullo | 2.5 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/s.wav` | Fricción | 0.65 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/f.wav` | Aire | 1.2 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/ta.wav` | Contacto | 0.32 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |
| `audio/ka.wav` | Quiebre | 0.4 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0-1.0 |

La cuadrícula invisible asigna, por filas: A, E, I, O, U / M, S, F, TA, KA. No depende de la cantidad de tinta: el disparador en T07 es el contacto. 

Al apoyar el dedo, la muestra se reproduce en bucle con entrada suave. Hasta el umbral conserva un timbre próximo al original. Después crece una saturación progresiva, la reproducción desciende aproximadamente a la mitad de velocidad con una oscilación añadida, el filtro pasa de 8500 a 700 Hz y el eco de 80 a 240 ms, con realimentación limitada al 32 %. El desfase es deliberado: insistir produce más transformación, pero no mayor conocimiento del documento. Al soltar, la voz se desvanece y el eco breve se extingue. El volumen general es ajustable y se limita la suma de varios contactos.

 El catálogo conserva la descripción material de las tres cartas y sus distintas páginas.

### Gráfica y estructura

El marfil se relaciona con el soporte; el azul cobalto, con la tinta y con la continuidad gráfica del archivo anterior. La tipografía serif da escala editorial a la escritura; las etiquetas monoespaciadas distinguen datos y controles. La nube azul de portada es gráfica; sobre el documento, la respuesta se mantiene localizada en el contacto.

- `index.html`: experiencia del computador.
- `telefono.html`: control táctil.
- `app.js`: sincronización MQTT, catálogo y dibujo.
- `interaction.mjs`: reglas de coordenadas y permanencia.
- `sound.js` y `audio/`: reproducción, deformación y diez muestras con manifiesto.
- `letters-manifest.json` y `letters/`: catálogo e imágenes.
- `vendor/`: cliente MQTT y generador QR con sus licencias.
- `style.css`: composición y adaptación a pantallas pequeñas.
- `tests.mjs`: comprobaciones de las reglas de interacción.
- `EMPIEZA_AQUI.md`: publicación y prueba paso a paso.

## 3. Reflexión

El sistema plantea que acceder a un archivo no equivale a agotarlo. La misma acción que vuelve visible la escritura puede hacerla escapar. La deformación no revela una verdad de quien escribió: hace visible una condición que yo diseño para quien lee.

También hay una reducción: el contacto real queda convertido en posición y tiempo. El sistema no reconoce la intención del gesto, la emoción, la presión verdadera ni el sentido de las palabras. Tampoco recupera cómo sonaban las voces de quienes escribieron: sus fonemas sintéticos hacen audible una traducción diseñada, con un límite técnico que no se oculta. Una permanencia puede expresar atención o simplemente una interrupción; aquí ambas producen el mismo resultado. La borrosidad puede dificultar el acceso a algunas personas y el tamaño de la pantalla modifica la experiencia. Estos límites deben discutirse junto a su efecto poético.

**Mejoras concretas:**

1. Incorporar una calibración por teléfono para ajustar escala, tolerancia al temblor y latencia; añadir una lectura accesible alternativa y controles por teclado.
2. Probar con lectores reales diferentes umbrales de permanencia y comparar si distinguen aproximación, lectura y pérdida; ajustar la curva según esas observaciones.
3. Migrar del broker público a uno administrado con autenticación y sesiones con caducidad.

**Estado de verificación:** las reglas automáticas y el intercambio entre dos clientes MQTT se probaron durante el desarrollo. 
