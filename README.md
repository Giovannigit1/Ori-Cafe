# Ori Café — Plataforma de Capacitación Barista

Plataforma web de capacitación digital guiada para **Ori Café**, una cafetería de especialidad en Santiago de Chile. Diseñada con un enfoque *mobile-first* (390 px) para operarse con una sola mano detrás de la barra, sin temporizadores invasivos, con lenguaje claro en español chileno y con modo oscuro automático.

---

## ☕ Características Principales

1. **Receta Estandarizada de Espresso**:
   - **Dosis de café molido**: `18 g` (en el portafiltro).
   - **Rendimiento (espresso)**: `21 g` (líquido en taza).
   - **Tiempo de extracción**: `25 segundos` (rango óptimo: 23 a 28 s).
   - Claramente diferenciados para evitar confusiones en barra.
2. **6 Módulos de Aprendizaje**:
   - `01. Cappuccino` (Ficha técnica)
   - `02. Latte` (Ficha técnica)
   - `03. Texturizado de leche` (Técnica con selector interactivo de leches vaca y vegetales)
   - `04. Calibración del espresso` (Diagnóstico visual e interactivo de sabor)
   - `05. Protocolo de atención al cliente` (Guía de hospitalidad y frases clave de barra)
   - `06. Química del texturizado de leche` (Lectura y tabla comparativa)
3. **Práctica Guiada Ergonómica**:
   - Un paso a la vez en pantalla completa.
   - Widget circular de taza de café que se llena progresivamente según el paso.
   - Chips flotantes con parámetros de la receta.
   - Herramientas integradas en los pasos: selector de leches, diagnóstico de sabor, termómetro.
   - Cero cronómetros; tiempos explícitos en texto ("25 segundos").
4. **Evaluaciones Rápidas (Quiz)**:
   - Una pregunta a la vez con retroalimentación instantánea (verde para correcta, rojo para incorrecta).
   - Al finalizar, guarda el avance y puntaje del barista en su dispositivo.
5. **Control Diario de Calibración**:
   - Horarios predeterminados: Apertura (`08:30`), Mediodía (`12:30`) y Tarde (`16:30`).
   - Notificación destacada si un turno pasó sin calibrar, con botón *"Calibrar ahora"* y *"Ya la hice"*.
   - El título de la pestaña del navegador avisa proactivamente `Calibrar ahora | Ori Café`.
6. **Modo Editor Completo**:
   - Permite editar títulos, parámetros, pasos, consejos, controles de calidad y preguntas.
   - Agregar, eliminar (con confirmación) y reordenar (subir/bajar) pasos y módulos.
   - Creación de nuevos módulos de los 5 tipos disponibles.
   - Exportación e importación de copias de seguridad en formato JSON (`.json`).

---

## 🛠️ Tecnologías Utilizadas

- **Vite + React 18 + TypeScript**: Alto rendimiento y tipado estricto sin dependencias pesadas.
- **CSS Modular con Variables Semánticas**: Paleta cálida artesanal (`#F7F6F3`, `#2A1A12`, `#A9661F`, `#4F7A3A`, `#A63A2C`) y modo oscuro automático para barras tenues.
- **Tipografías de Alta Legibilidad**: *Bricolage Grotesque* (Google Fonts) para títulos y *Atkinson Hyperlegible* para el cuerpo de texto.
- **Hash Router**: Rutas seguras `#/...` compatibles con cualquier servidor estático sin problemas de recarga 404.

---

## 🚀 Cómo Correr el Proyecto en Local

### Prerrequisitos
- Node.js versión 18 o superior.
- npm (incluido con Node.js).

### Instalación y Ejecución
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev
```

Abre tu navegador en `http://localhost:3000` (o el puerto indicado en la terminal).

Para simular la experiencia real detrás de la barra:
1. Abre las herramientas de desarrollador (`F12` en Windows).
2. Activa el modo responsivo de dispositivo (`Ctrl + Shift + M`).
3. Selecciona dimensiones móviles como **iPhone 12/13/14 (390 x 844 px)**.

---

## 📝 Cómo Editar y Respaldar el Contenido

1. Haz clic en el botón superior derecho **"⚙️ Modo Editor"** (o navega a `#/editar`).
2. Puedes seleccionar cualquier módulo para editar sus textos, parámetros, pasos y preguntas.
3. Para cambiar el orden de los módulos o pasos, usa los botones `↑` y `↓`.
4. Para guardar los cambios de forma persistente, pulsa **"💾 Guardar Cambios en la Barra"** en la barra fija inferior.
5. **Respaldar / Compartir con otro barista**:
   - Haz clic en **"📥 Exportar JSON"** para descargar el archivo `ori-cafe-contenido-YYYY-MM-DD.json`.
   - En otro teléfono, abre el Modo Editor y pulsa **"📤 Importar JSON"** para cargar dicho archivo.

---

## ☁️ Arquitectura de Datos: Fase 1 y Fase 2 (Firebase)

- **Fase 1 (Activa)**:
  - Todo el contenido editable se almacena en `localStorage` bajo `ori_cafe_contenido_v1`.
  - El progreso individual del barista y las calibraciones se guardan aisladas en su propio dispositivo (`ori_cafe_progreso_v1` y `ori_cafe_calibraciones_v1`) protegidas con bloques `try/catch`.
- **Fase 2 (Lista para conectar)**:
  - La capa `src/lib/almacen.ts` implementa la interfaz `ServicioAlmacen`, permitiendo intercambiar `LocalAlmacenService` por `FirebaseAlmacenService`.
  - Para conectar Firestore y Firebase Auth (para que solo el encargado edite y los baristas lean en tiempo real):
    1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com).
    2. Crea un archivo `.env.local` con las credenciales:
       ```env
       VITE_FIREBASE_API_KEY=tu_api_key
       VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
       VITE_FIREBASE_PROJECT_ID=tu_proyecto
       VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
       VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
       VITE_FIREBASE_APP_ID=tu_app_id
       ```
    3. Habilita Cloud Firestore y Firebase Authentication.

---

## 🌐 Despliegue en Netlify

El proyecto ya cuenta con `netlify.toml` y `public/_redirects` configurados para compilar y servir la aplicación de forma 100% funcional.

### Opción A: Desde GitHub (Recomendado)
1. Sube este repositorio a tu cuenta de GitHub.
2. En [Netlify](https://app.netlify.com), haz clic en **"Add new site"** → **"Import an existing project"** y selecciona tu repositorio.
3. Netlify detectará automáticamente:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Pulsa **"Deploy site"** y estará en línea en segundos.

### Opción B: Con Netlify CLI
```bash
# Compilar producción
npm run build

# Desplegar
npx netlify deploy --prod --dir=dist
```

---

## 📦 Compilación y Despliegue en Firebase Hosting

### 1. Compilar para Producción
```bash
npm run build
```
Esto generará los archivos estáticos optimizados en la carpeta `dist/`.

### 2. Desplegar en Firebase Hosting
Si tienes instalada la CLI de Firebase:
```bash
# Iniciar sesión en Firebase (si no lo has hecho)
firebase login

# Inicializar proyecto (selecciona Hosting)
firebase init hosting

# Desplegar
firebase deploy
```
El archivo `firebase.json` ya se encuentra preconfigurado con las reglas de enrutamiento y carpeta `dist/`.
