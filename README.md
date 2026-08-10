# Camila Bento · Psicóloga

Landing page para Camila Bento, psicóloga clínica en Ciudad del Este,
Paraguay. Sitio estático (HTML/CSS/JS), sin build ni dependencias de
instalación — se sirve directo.

Tipografía editorial (Fraunces + DM Sans), modo claro/oscuro,
animaciones con GSAP y detalles ilustrados a mano (doodles en SVG).

## Estructura

```
/
├── index.html
├── site.webmanifest
├── css/
│   └── style.css
├── js/
│   ├── script.js          # interacción del sitio
│   └── lottie-data.js     # animación Lottie del footer, incrustada
└── img/
    ├── foto-1.webp … foto-4.webp
    └── favicon/
        ├── favicon.ico
        ├── favicon.svg
        ├── favicon-96x96.png
        ├── apple-touch-icon.png
        ├── web-app-manifest-192x192.png
        └── web-app-manifest-512x512.png
```

## Stack

- HTML5 + CSS3 (variables CSS para tema claro/oscuro)
- JavaScript vanilla (sin framework)
- [GSAP](https://gsap.com/) + ScrollTrigger — animaciones de scroll
- [lottie-web](https://github.com/airbnb/lottie-web) — animaciones `.json`
- Modelo 3D embebido vía [Spline](https://spline.design/)

## Características

- Hero con modelo 3D interactivo, con carga diferida (`IntersectionObserver`)
- Modo claro/oscuro persistente (`localStorage`)
- Slider de fotos con lightbox (navegación por teclado, swipe en mobile)
- Dos carruseles tipo marquee:
  - Especialidades — arrastrable (mouse/touch) con autoplay
  - Fotografías — autoplay fijo, con lightbox integrado
- Doodles SVG decorativos, con variantes de fondo a tamaño completo en mobile
- Slots de animación Lottie listos para usar (ver abajo)
- Totalmente responsive

## Animaciones Lottie

El sitio carga `lottie-web` vía CDN y expone tres contenedores:

| Selector | Estado | Fuente |
|---|---|---|
| `.footer-lottie` | Activo | `js/lottie-data.js` (`data-lottie-key="deep-learning"`) |
| `#procesoLottie` | Vacío | `data-lottie-src` |
| `#ctaBandLottie` | Vacío | `data-lottie-src` |

Cada contenedor se activa automáticamente si tiene una fuente
asignada (por `data-lottie-src="url.json"` o una clave presente en
`window.LOTTIE_DATA`); si no, permanece oculto sin afectar el layout.

## Favicon

Genera el set completo de íconos (favicon, apple-touch-icon, Android
Chrome) con [RealFaviconGenerator](https://realfavicongenerator.net)
a partir de una imagen cuadrada de al menos 512×512px, y colocá los
archivos resultantes en `img/favicon/`:

```
img/favicon/
├── favicon.ico
├── favicon.svg
├── favicon-96x96.png
├── apple-touch-icon.png
├── web-app-manifest-192x192.png
└── web-app-manifest-512x512.png
```

Los nombres de los dos últimos archivos pueden variar según la
versión del generador — si no coinciden, ajustar las rutas dentro de
`site.webmanifest`.

## Licencia

Proyecto privado — todos los derechos reservados.
