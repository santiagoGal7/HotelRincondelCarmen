# Hotel El Rincón del Carmen 🏨

## Descripción General 📝

Hotel El Rincón del Carmen es una aplicación web para la gestión de reservas de un hotel. Permite a los usuarios explorar servicios del hotel, realizar y gestionar reservas, registrarse e iniciar sesión como usuario o administrador, y disfrutar de un diseño responsivo y atractivo. La aplicación utiliza HTML, JavaScript, Tailwind CSS y `localStorage` para manejar datos en formato JSON.

## Características ✨

- **Módulo Inicio**: Incluye un carrusel de imágenes y secciones de **Gastronomía**, **Spa** y **Zonas Húmedas** con descripciones e imágenes (pendientes de cargar).
- **Módulo Reservas**: Permite acceder a reservas sin necesidad de iniciar sesión, con validación de solapamiento de fechas. Muestra el estado del usuario ("Invitado", "Bienvenido, \[nombre\]" o "Administrador").
- **Módulo Registro e Inicio de Sesión**: Formulario completo con campos de identificación, nombre, nacionalidad, email, teléfono y contraseña. Soporta registro y login de usuarios y administradores (credenciales admin: `admin`/`admin123`). **Nota**: El botón "Iniciar Sesión" no funciona actualmente debido a un problema en la asignación de eventos en `nav-menu.js`.
- **Módulo Contacto**: Sección para información de contacto.
- **Gestión de Administrador**: Permite gestionar habitaciones y reservas (visible solo para admin).
- **Diseño**: Responsivo y atractivo, implementado con Tailwind CSS.
- **Persistencia de Datos**: Usa `localStorage` para almacenar usuarios, reservas y datos de admin en formato JSON.
- **Validaciones**: Incluye validación de email, teléfono y solapamiento de reservas.

## Estado del Proyecto 🚧

La mayor parte del proyecto está funcional, incluyendo los módulos de **Inicio**, **Reservas** y **Contacto**. Sin embargo, el botón **Iniciar Sesión** no carga el formulario debido a un problema en el evento `click` del módulo `auth` en `nav-menu.js`. Se implementaron logs de depuración para rastrear el error, y se intentó usar `document.createElement('reg-usuario')` sin éxito antes de la entrega. El formulario de `<reg-usuario>` está completamente implementado y listo para funcionar una vez solucionado el evento.

## Estructura del Proyecto 📂

```
HotelRincondelCarmen/
├── app/
│   ├── components/
│   │   ├── nav-menu.js        # Barra de navegación
│   │   ├── reg-usuario.js     # Formulario de registro e inicio de sesión
│   │   ├── hotel-component.js # Gestión de reservas y habitaciones
│   │   ├── carousel.js        # Carrusel del módulo Inicio
│   │   ├── contacto.js        # Sección de contacto
│   │   ├── reg-habitacion.js  # Registro de habitaciones (admin)
│   │   ├── lst-habitaciones.js # Listado de habitaciones
│   │   ├── reg-reserva.js     # Formulario de reservas
│   │   └── lst-reservas.js    # Listado de reservas
│   ├── apis/
│   │   ├── usuarioApi.js      # API para usuarios
│   │   ├── adminApi.js        # API para administradores
│   │   ├── habitacionApi.js   # API para habitaciones
│   │   └── reservaApi.js      # API para reservas
├── js/
│   ├── utils.js               # Funciones utilitarias (e.g., initLocalStorage)
├── images/
│   ├── servicios/
│   │   ├── gastronomia/       # Imágenes de gastronomía (pendientes)
│   │   ├── spa/               # Imágenes de spa (pendientes)
│   │   └── piscina/           # Imágenes de zonas húmedas (pendientes)
├── index.html                 # Página principal
├── app.js                     # Inicialización de la aplicación
└── README.md                  # Documentación
```

## Requisitos 📋

- Navegador moderno (Chrome, Firefox, Edge).
- Live Server para desarrollo local (recomendado).
- Conexión a internet para cargar Tailwind CSS desde CDN (`https://cdn.tailwindcss.com`).

## Instalación y Ejecución 🚀

1. Clona el repositorio:

   ```bash
   git clone <URL_REPOSITORIO>
   cd HotelRincondelCarmen
   ```

2. Abre el proyecto en VS Code.

3. Instala la extensión **Live Server** (si no la tienes).

4. Haz clic derecho en `index.html` y selecciona **Open with Live Server**.

5. Accede a la aplicación en `http://127.0.0.1:5500`.

## Uso 🖱️

- **Inicio**: Explora el carrusel y las secciones de Gastronomía, Spa y Zonas Húmedas.
- **Reservas**: Crea y visualiza reservas. Sin login, se muestra como "Invitado". Los administradores ven opciones adicionales para gestionar habitaciones.
- **Contacto**: Visualiza la información de contacto.
- **Iniciar Sesión**:
  - Para registrar un usuario, haz clic en "Nuevo", completa los campos y haz clic en "Guardar".
  - Para login de usuario: Usa el ID registrado y la contraseña (e.g., ID: `123`, contraseña: `test123`).
  - Para login de admin: Usa `admin`/`admin123`.
  - **Nota**: El botón "Iniciar Sesión" no funciona actualmente, pero el formulario está implementado en `reg-usuario.js`.
- **Cerrar Sesión**: Disponible tras login, cambia la navbar a "Cerrar Sesión (Usuario)" o "Cerrar Sesión (Admin)".

## Problemas Conocidos ⚠️

- **Botón "Iniciar Sesión"**: No carga el formulario debido a un error en el evento `click` del módulo `auth` en `nav-menu.js`. Los logs de depuración muestran que otros módulos funcionan, pero no `auth`.
- **Imágenes**: Las imágenes de Gastronomía, Spa y Zonas Húmedas están referenciadas en `images/servicios/`, pero no cargadas, causando errores 404 en la consola.
- **Tailwind Warning**: La consola muestra una advertencia sobre el uso de `cdn.tailwindcss.com` en producción, pero es ignorable para este proyecto académico.

## Depuración 🛠️

Para rastrear el problema del botón "Iniciar Sesión":

1. Abre DevTools (F12) &gt; Console.
2. Haz clic en "Iniciar Sesión".
3. Busca logs como:
   - `NavMenu: Click en módulo auth`
   - `NavMenu: Intentando cargar reg-usuario`
   - `RegUsuario: Constructor ejecutado`
4. Si no aparecen, el problema está en el selector `.nav-link` o la importación de `reg-usuario.js`.

## Autores ✒️

- **Santiago Gallo** - Desarrollo principal, implementación de módulos y diseño.
- **j3** - Colaborador en el desarrollo.

## Futuras Mejoras 🔮

- Corregir el evento `click` del botón "Iniciar Sesión" en `nav-menu.js`.
- Añadir imágenes optimizadas en `images/servicios/`.
- Implementar un menú móvil para mejorar la responsividad.
- Agregar más validaciones en el frontend para reservas.

## Enlace al Proyecto 🌐

Hotel El Rincón del Carmen [(enlace )](dashing-lamington-b8a2d6.netlify.app/)
