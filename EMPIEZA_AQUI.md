# Actualizar la versión publicada

Esta revisión corrige el desenfoque en iPhone, permite leer al deslizar y adelanta la deformación. También elimina el panel de ajustes y cambia el texto final.

1. En GitHub entra a tu repositorio y pulsa Add file → Upload files.
2. Desde este ZIP descomprimido sube: `index.html`, `telefono.html`, `app.js`, `interaction.mjs`, `blur.mjs`, `sound.js`, `style.css` y esta documentación. Deben quedar en la raíz.
3. No necesitas volver a subir `letters`, `audio` ni `vendor` si ya están completas. No sobrescribas tu README personalizado sin conservar antes los enlaces que añadiste.
4. Pulsa Commit changes, espera el despliegue y recarga el computador con ⌘ + Mayúsculas + R.
5. Cierra la pestaña anterior del teléfono y vuelve a escanear el QR. Prueba nitidez al deslizar y deformación al detenerte.

---

# Publicar y probar — paso a paso

Este es un proyecto NUEVO para T07. No reemplaces tu repositorio anterior `agotar-el-archivo` de T06.

## 1. Antes de cerrar la entrega

Esta versión incluye diez sonidos de la entrega anterior. No requiere excepción por ausencia de sonido. Falta comprobar la experiencia completa con tu teléfono físico y publicar el sitio.

## 2. Crear el repositorio

1. Descomprime este ZIP en Finder.
2. En GitHub, crea un repositorio **Public** llamado `agotar-el-archivo-tacto`.
3. Descripción sugerida: `Tres cartas recuperadas se revelan al contacto y se deforman con la insistencia. Experiencia táctil entre teléfono y computador conectados por MQTT. Fernanda Angel · T07 Tacto · DPPI 2026.`
4. Puedes dejar desactivada la opción de agregar README: el paquete ya incluye uno.
5. Crea el repositorio y elige **uploading an existing file**, o **Add file → Upload files**.
6. Abre la carpeta descomprimida. Selecciona TODO lo que contiene y arrástralo a la zona de carga de GitHub, incluyendo las carpetas `letters` y `vendor` completas.
7. No subas el ZIP ni una carpeta contenedora que deje todo dentro de otra carpeta. En la raíz del repositorio deben verse `index.html`, `telefono.html`, `app.js`, `README.md`, `letters` y `vendor`.
8. Escribe `Versión T07 — lectura por contacto` y pulsa **Commit changes**.

## 3. Activar GitHub Pages

1. Dentro de ese repositorio abre **Settings → Pages**.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Elige **main** y **/(root)**, y pulsa **Save**.
4. Espera a que GitHub muestre el enlace de tu sitio y pulsa **Visit site**. Si aún no aparece, revisa la pestaña **Actions** y espera a que finalice el despliegue.
5. Abre ese enlace en tu computador. Para esta forma de publicación no necesitas Terminal ni Python.

## 4. Probar con el teléfono

1. En el computador, elige una de las cartas y una página de escritura.
2. Pulsa **Activar sonido** en el computador y empieza con volumen bajo. Espera «MQTT conectado» y escanea el QR con tu teléfono. Abre el enlace del QR, no escribas simplemente la dirección principal del sitio.
3. Comprueba que ambos muestran la misma carta.
4. Apoya el dedo sobre una palabra. La zona debe aclararse prácticamente al instante en ambas pantallas.
5. Sin moverlo, espera alrededor de medio segundo: la escritura debe comenzar a desplazarse en franjas y el sonido debe perder claridad, variar de tono y generar un eco.
6. Suelta. La zona vuelve gradualmente a su estado borroso.
7. Desliza para recorrer otra línea; cambia al menos una carta y comprueba que el teléfono se actualiza.
8. Comprueba que deslizar mantiene la zona legible y que detenerte más de 0,55 s inicia la deformación. No hay panel de ajustes en esta versión.
9. Haz la prueba con datos móviles y con Wi-Fi si es posible. No necesitan la misma red; sí internet.

## 5. Si algo falla

- **No aparecen las fotos:** confirma que existe `letters/` en la raíz y que sus nombres y mayúsculas coinciden.
- **No suena:** pulsa «Activar sonido» en el computador; sube su volumen y comprueba la carpeta `audio`. El teléfono no reproduce sonido.
- **No aparece el QR:** confirma `vendor/qrcode.js`. Puedes usar «Copiar enlace» y enviarlo a tu propio teléfono.
- **El teléfono no muestra carta:** deja abierto el computador, vuelve a escanear su QR y espera la conexión. Si recargaste el computador y cambió la sala, usa el QR nuevo.
- **Dice reconectando:** verifica internet, desactiva una VPN si tú la estás usando y vuelve a probar. El broker público puede estar temporalmente indisponible; no es un problema que se arregle subiendo otra vez las cartas.
- **La página funciona con ratón pero no con teléfono:** la prueba local no usa MQTT; revisa ambos mensajes de conexión y que abriste el enlace del QR.
- **Ves un README en lugar de la web:** `index.html` quedó dentro de otra carpeta, o Pages no está usando `main / (root)`.

## 6. Completar README y video

1. En GitHub abre `README.md` y pulsa el lápiz.
2. Reemplaza el párrafo «Publicación pendiente» por el enlace real del repositorio, el enlace que muestra Pages y el enlace del video cuando lo subas.
3. Después de probar, añade a la reflexión una observación real: qué hiciste, qué ocurrió y qué ajustarías. No necesitas cambiar el concepto.
4. Graba 30–60 segundos donde se vean a la vez el teléfono y el computador. Puedes filmarlos desde otro celular: así se comprueba el control remoto, cosa que una captura de pantalla sola no demuestra.
5. Guion de 45 segundos: 0–8 s nombre y elección de carta; 8–18 s tocar y aclarar; 18–30 s sostener y deformar; 30–38 s soltar y recorrer; 38–45 s cambiar la carta y repetir.
6. Sube el video a un lugar accesible por enlace o al medio que admita la entrega. Si usas YouTube, déjalo «No listado», no «Privado». Prueba el enlace sin tu sesión.

## 7. Lista final según la pauta

- [ ] Concepto explicado y vínculo con Blanchot correctamente presentado como interpretación.
- [ ] Tres cartas, página seleccionable y transformación local por tacto.
- [ ] Teléfono físico controla el computador a través de MQTT.
- [ ] Diseño coherente y controles que funcionan.
- [ ] README con concepto, funcionamiento/tabla de conexiones y reflexión con dos mejoras.
- [ ] Se añadió al README una observación de la prueba real.
- [ ] Sitio público en GitHub Pages probado desde otro dispositivo.
- [ ] Enlaces del repositorio y del sitio.
- [ ] Video de 30–60 segundos mostrando ambos dispositivos.
- [ ] Diez muestras presentes, atribución/licencia en README, activación de sonido y deformación progresiva comprobadas.

La pauta copiada indica que la tarea quedó bloqueada el 12 de noviembre. Si el curso mantiene ese bloqueo, la recepción tardía también debe acordarse con el profesor; no basta con publicar el sitio.
