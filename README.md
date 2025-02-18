# Phrases Challenge

Este proyecto es una aplicación web realizada con **React** (utilizando **Vite**) que permite agregar frases, buscarlas y gestionarlas, incluyendo la posibilidad de marcarlas como favoritas. Se basa en un esquema de tarjetas (cards) y cuenta con **infinite scroll** para la carga progresiva de más frases.

## Características

1. **Agregar Frases**  
   - Se pueden ingresar nuevas frases que serán mostradas como tarjetas en una matriz.

2. **Búsqueda de Frases**  
   - Se incluye una barra de búsqueda en tiempo real usando la librería [FUSE](https://fusejs.io/), la cual permite filtrar rápidamente las tarjetas que contengan el texto ingresado.

3. **Eliminar Frases**  
   - Cualquier frase puede ser eliminada, lo que removerá su tarjeta de la visualización.

4. **Favoritos y Ordenamiento**  
   - Las frases se pueden marcar como favoritas, ubicándolas primero, seguidas de las frases más recientes.

5. **Infinite Scroll**  
   - Las tarjetas se cargan de manera progresiva a medida que se hace scroll, mejorando la experiencia de usuario en la navegación.

6. **UI/Estilos**  
   - Se usan **MUI** y **Tailwind CSS** para el diseño de la interfaz y componentes.
  
7. **API Externa**  
   - Se usa un JSON generator para simular una API externa para consumir las frases al iniciar.

8. **Patrones**  
   - Se utilizó el patron de Factory para el logger, dependiendo el ambiente es el nivel que va a generar los logs. Con esta solucion el dia de mañana podria integrar Sentry facilmente para persistir los logs que se generan en produción.
   - Se utilizó el patron de Strategy para persistir las frases. En este caso, el dev los persiste en el Session Storage y en prod en el Local Storage. En un futuro se podría cambiar la estrategia utilizada para producción y que lo guarde en una BBDD.
  
9. **Estados Globales**  
   - Se utilizó Context para el manejo de estados globales. Podría utilizarse Redux ToolKit, pero no hacia falta para est aaplicación.

   10. **Custom Hook**  
      - Se implementó un hook personalizado para gestionar la interacción con la capa de servicio encargada de la obtención de datos desde la API. Esta solución contribuye a una estructura de código más limpia, modular y mantenible, mejorando la separación de responsabilidades dentro de la aplicación.

## Tecnologías Utilizadas

- **React** + **Vite** para la construcción de la aplicación.
- **MUI** y **Tailwind CSS** para el diseño de la interfaz y componentes.
- **FUSE** para la búsqueda y filtrado de frases.
- **Docker** para la creación y despliegue de la imagen de la aplicación.

## Tecnologías para Testing

- **Jest:** Como test runner y framework de aserciones.
- **ts-jest:** Para integrar Jest con TypeScript.
- **React Testing Library:** Para testear componentes desde la perspectiva del usuario.
- **@testing-library/jest-dom:** Para aserciones extendidas (por ejemplo, `.toBeInTheDocument()`).
- **@testing-library/user-event:** Para simular interacciones del usuario de forma realista.

## Requisitos Previos

- [Docker](https://www.docker.com/) instalado en tu sistema.

## Pasos para Ejecutar la Aplicación

1. **Clona este repositorio** (o descarga los archivos):

   ```bash
   git clone https://github.com/dicolajuan/phrasesChallenge
   cd phrasesChallenge
   ```

2. **Construye la imagen de Docker**:
   
   ```bash
   docker build . -t "phrases-challenge:v1.0"
   ```

3. **Ejecuta el contenedor**:

   ```bash
   docker run -p 8080:8080 phrases-challenge:v1.0
   ```

4. **Accede a la aplicación**:
   - Abre tu navegador y ve a http://localhost:8080 para ver la aplicación en ejecución.

## Uso de la Aplicación

### Agregar Frase
En la parte superior (o donde se muestre el formulario), ingresa la frase que desees y haz clic en “Agregar”. Aparecerá una nueva tarjeta en la matriz.

### Buscar
En la barra de búsqueda, escribe el texto que quieras filtrar. La aplicación irá mostrando únicamente las tarjetas que coincidan con lo que vas tecleando, gracias a la librería [FUSE](https://fusejs.io/).

### Marcar como Favorito
En cada tarjeta, tendrás la opción de marcar la frase como favorita. Una vez marcada, se ubicará antes que las no favoritas, ordenándose a continuación por las más recientes.

### Eliminar
En cada tarjeta también encontrarás un botón o ícono para eliminar esa frase definitivamente.

### Scroll Infinito
A medida que hagas scroll, se irán mostrando más tarjetas, lo que permite manejar grandes cantidades de frases sin sobrecargar la interfaz.

## Ejecución de Tests

### Opción 1: Ejecutar los tests en tu máquina local

1. **Clona este repositorio** (o descarga los archivos):

   ```bash
   git clone https://github.com/dicolajuan/phrasesChallenge
   cd phrasesChallenge
   ```

2. **Instala las dependencias usando Yarn:**
   
   ```bash
   yarn install
   ```

3. **Ejecuta los tests:**
   
   ```bash
   yarn test
   ```

Si todos los tests pasan, verás un reporte de Jest confirmando que la suite se ejecutó correctamente.

### Opción 2: Ejecutar los tests en un contenedor temporal

1. **Clona este repositorio** (o descarga los archivos):

   ```bash
   git clone https://github.com/dicolajuan/phrasesChallenge
   cd phrasesChallenge
   ```

2. **Ejecuta el siguiente comando para correr los tests en un contenedor temporal:**
   
   ***Si se ejecuta en un ambiente linux o Mac se debe usar***
   ```bash
      docker run --rm \
     -v "$(pwd)":/app \
     -w /app \
     node:18-alpine \
     sh -c "yarn install && yarn test"
   ```

   ***Si se ejecuta en powershell se debe utilizar***
   ```bash
      docker run --rm `
     -v "$(pwd)":/app `
     -w /app `
     node:18-alpine `
     sh -c "yarn install && yarn test"
   ```
