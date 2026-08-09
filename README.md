# Camila Bento · Psicóloga — sitio web

Landing page de Camila Bento, psicóloga clínica en Ciudad del Este,
Paraguay. Diseño oscuro/claro, tipografía editorial (Fraunces + DM
Sans), animaciones con GSAP y detalles hechos a mano (doodles SVG)
para que se sienta cálido y humano, no frío.

## Estructura del proyecto

```
/
├── index.html
├── site.webmanifest
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── script.js          → toda la interacción del sitio
│   └── lottie-data.js     → animación Lottie del footer, incrustada
└── img/
    ├── foto-1.webp … foto-4.webp   → fotos de Camila (slider + marquees)
    └── favicon/
        ├── favicon.ico
        ├── favicon-16x16.png
        ├── favicon-32x32.png
        ├── apple-touch-icon.png
        ├── android-chrome-192x192.png
        └── android-chrome-512x512.png
```

Subí todo respetando esta misma estructura de carpetas (nombres de
archivo exactos, en minúscula). El `index.html` ya apunta a cada ruta,
no hace falta tocar código para reemplazar fotos o el favicon.

## Qué incluye el sitio

- **Hero** con modelo 3D interactivo (Spline), que carga una sola vez
  al entrar en pantalla (no se remonta al hacer scroll, para evitar
  parpadeos).
- **Modo claro/oscuro** con toggle en el header.
- **Slider de fotos** en "Sobre mí" con lightbox (clic para agrandar,
  flechas para navegar, swipe en mobile).
- **Primer marquee** ("Un acompañamiento para cada momento"): fotos +
  íconos de especialidades hechos a mano. Se puede **arrastrar** con
  mouse o dedo; si no lo tocás, se desliza solo.
- **Segundo marquee** ("Un rostro humano..."), después de Testimonios:
  solo fotos de Camila en zigzag, con caption. Auto-scroll fijo (sin
  arrastre). Clic en cualquier foto la agranda (mismo lightbox del
  slider de "Sobre mí").
- **Doodles SVG** a mano (corazón, flor, espiral, rosa, subrayado)
  repartidos por todas las secciones para darle calidez. En Servicios
  y Proceso hay versiones grandes de fondo, solo visibles en mobile.
- **Slots de Lottie** listos para usar — ver sección siguiente.
- Formulario/CTA, testimonios, footer con reveal de texto gigante y
  animación Lottie decorativa.

## Animaciones Lottie

El sitio ya tiene la librería (`lottie-web`, vía CDN) y tres lugares
preparados. Cada uno se activa solo si tiene una fuente asignada — si
no, no se nota que están ahí.

| Ubicación | Cómo se activa |
|---|---|
| Footer (junto al texto "Camila Bento") | Ya activo — usa `js/lottie-data.js` (`data-lottie-key="deep-learning"`) |
| Sección "El proceso" (`#procesoLottie`) | Vacío — pegar un link `.json` en `data-lottie-src` dentro del `index.html` |
| Franja CTA ("¿Estás listo para comenzar?") (`#ctaBandLottie`) | Vacío — mismo mecanismo |

Para agregar una nueva animación por **link** (más simple, pero
requiere que el link no se caiga con el tiempo):
```html
<div class="proceso-lottie" data-lottie-src="https://.../animacion.json"></div>
```

Para **incrustarla directo en el código** (más robusto, no depende de
ningún link externo — así se hizo con la del footer): pasarme el
archivo `.json` y yo la agrego a `js/lottie-data.js`.

## Favicon — cómo generarlo bien

Un solo `.png` no alcanza: para que se vea en mobile, iOS, accesos
directos de Android y asistentes de IA (Copilot, etc.) hacen falta
varios tamaños y formatos a la vez.

**Pasos:**

1. Andá a **[realfavicongenerator.net](https://realfavicongenerator.net)**.
2. Subí la imagen del logo (cuanto más grande y cuadrada, mejor —
   idealmente 512×512px o más).
3. Descargá el paquete generado y colocá estos 6 archivos dentro de
   `img/favicon/` (mismos nombres que ya están puestos en el
   `index.html`):
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

Si me pasás la imagen fuente del logo directo acá en el chat, te los
genero yo mismo y te los dejo ya listos para subir.

## Reemplazar las fotos de Camila

Las fotos se usan en 3 lugares con los mismos 4 archivos
(`img/foto-1.webp` a `foto-4.webp`): el slider de "Sobre mí", el
primer marquee y el segundo marquee. Alcanza con reemplazar esos 4
archivos (mismo nombre, mismo formato `.webp`) para que se actualicen
solos en los tres lugares.
