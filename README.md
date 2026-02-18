# Events App

## Instalación

Una vez clonado el proyecto, instala las dependencias con el comando

`pnpm install`

(Puedes ver las opciones para instalar pnpm desde [aquí](https://pnpm.io/installation))

Una vez instaladas las dependencias, tienes dos opciones para levantar el proyecto de manera local:

### 1.- Utilizar NX (Recomendado si ya tienes una cadena de conexión a base de datos mongo)

Asegúrate de crear el archivo **.env** tanto en **webapp-bff** como en **svs-events** y añadir la variable de entorno **DATABASE_URL** con tu cadena de conexión.

En el archivo **.env** de webapp-bff, añade también la variable BETTER_AUTH_URL con el valor http://localhost:4000 (si optas por especificar otro puerto para el servicio, también debes cambiarlo aquí).

Levanta el proyecto con el comando

`pnpm dev`

### 2.- Utilizar docker compose

Levanta el proyecto con el comando

`docker compose up --build`

## Opcionales Implementados

**GraphQl**: Se optó por simular una arquitectura de webapp + bff + microservicios para poder implementar GraphQl en la capa de bff y mostrar un pequeño esquema. Al ser el scope de la aplicación tan pequeño, no ofrece mucho para optar por subgraphs y/o Apollo Federation.

**Autenticación JWT**: Se añadió a través del framework de auth **Better Auth**, ya que es una librería moderna de fácil implementación, open source y ofrece buena documentación. También ofrece de la opción de implementar un endpoint de validación de tokens si fuese necesario (lo que es probable si se utiliza JWT).

**Docker**: Dockerfiles agregados en cada servicios y orquestados con docker compose para levantar el proyecto en local en conjunto con una instancia de MongoDB.

**Micro-frontend**: Si bien no está implementado por ser una app muy pequeña, la estructura de mono repo permitiría fácilmente separar los distintos microfronts en diferentes proyectos dentro de la carpeta **apps** para ser unificados utilizando Module Federation. Probablemente en este setup hipotético sería también conveniente crear una carpeta **packages** para albergar paquetes compartidos y reutilizables entre las distintas app, donde podría estar, por ejemplo, un sistema de diseño para manejar UX de manera transversal con Storybook o alguna librería similar.

**Testing Avanzado**: En el proyeto svs-events se dejó un test unitario al mismo nivel del archivo a testear (mongodb-events.repository.ts) y un archivo de muestra de testing e2e utilizando supertest, haciendo un setup de la app completa y sólo creando mocks para la capa de acceso a datos (el servicio de prisma en este caso). En el caso de la webapp, sólo se añadió un test e2e en un setup con vitest + playwright, no se añadió un test unitario ya que al ser un componente tan pequeño, hubiese sido muy similar al e2e ya implementado, pero de ser necesario se hubiera implementado con react-testing-library.

**CI/CD**: Se dejaron unos archivos de muestra con unos actions de github para desplegar webapp en Cloudfront y bff en Google Cloud Run. No fue probado su funcionamient pero están a modo de ejemplo ya que son actions que he utilizado en proyectos personales y con los que no he tenido problemas.

Al momento de escribir este README no hay endpoints para cambiar el estado de un evento (por defecto se crean con estado DRAFT), ni para marcar la asistencia del usuario loggeado a un evento en particular. Los sumaré post entrega pero lo dejo en claro por si se prefiere omitir estos features para la evaluación (también se puede hacer checkout al commit de edición de este archivo para evaluar el proyecto en este punto en particular.)

## Comentarios

- No están todos los commits del progreso de desarrollo del proyecto porque sinceramente no leí ese punto en un principio y cuando lo ví ya estaba en la etapa final de desarrollo.

- Se utilizó Open Code + Gemini para agilizar un poco el setup de ciertas cosas, pero tengo entendimiento de todo lo implementado en caso de que existan preguntas.
