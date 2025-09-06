## Node versão
`v20.19.4`

## Docker versão
`Docker version 28.3.3`

## Subir bando de dados com docker
`docker compose up -d`

## Instalar pacotes
`npm install`

## Executar migrate
`npm start`

## Executar aplicação
`npm start`

## Executar testes
`npm test`

## Arquitetura
```
src/
 ├─ controllers/
 │   ├─ userController.js
 │   ├─ categoriaController.js
 │   ├─ pautaController.js
 │   └─ votoController.js
 ├─ services/
 │   ├─ categoriaService.js
 │   ├─ userService.js
 │   ├─ pautaService.js
 │   └─ votoService.js
 ├─ repositories/
 │   ├─ categoriaRepository.js
 │   ├─ userRepository.js
 │   ├─ pautaRepository.js
 │   └─ votoRepository.js
 ├─ routes/
 │   ├─ categoriaRoutes.js
 │   ├─ userRoutes.js
 │   ├─ pautaRoutes.js
 │   └─ votoRoutes.js
```