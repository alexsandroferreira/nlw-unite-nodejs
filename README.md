#  fastify-node-api-template 
![](https://github.com/alexsandroferreira/fastify-node-api-template/workflows/CHANGELOG%20Generator/badge.svg)

Este é um projeto base para criar aplicativos Node.js utilizando Fastify e TypeScript. Ele serve como um template que oferece as seguintes características:
- Integração contínua para automatização do changelog.
- Lint seguindo o guia de estilo da rocketseat/node.
- Automação através do Husky:
    - Script de lint para correção de erros.
    - Script de verificação de commits usando o formato convencional.
- Plugin de lint para organização dos imports.
- Extensão rest clint para testes locais de api

## Tabela de Conteúdos

- [Tecnologias](#tecnologias)
- [Instalação e Configuração](#instala%C3%A7%C3%A3o-e-configura%C3%A7%C3%A3o)
  - [Requisitos](#requisitos)
  - [Instalação](#instala%C3%A7%C3%A3o)
- [Licença](#licen%C3%A7a)

## Tecnologias 🛠️

Este projeto foi construído com as seguintes tecnologias:

- [Node.js »](https://nodejs.org)
- [Fastify »](https://fastify.dev/)
- [Typescript »](https://www.typescriptlang.org)
- [Zod »](https://zod.dev/)
- [@fatify-type-provider-zod »](https://github.com/turkerdev/fastify-type-provider-zod)
- [@fatify-sweagger »](https://github.com/fastify/fastify-swagger)
- [@fatify-sweagger-ui »](https://github.com/fastify/fastify-swagger-ui)
- [Eslint »](https://eslint.org/docs/latest/)
- [Eslint »](https://github.com/lydell/eslint-plugin-simple-import-sort)
- [@eslint-plugin-simple-import-sort »](https://github.com/Rocketseat/eslint-config-rocketseat)
- [husky »](https://typicode.github.io/husky/)
- [Commitlint »](https://commitlint.js.org/)
- [release-it »](https://github.com/release-it/release-it)
- [extensão vs code rest client »](https://github.com/Huachao/vscode-restclient)

## Instalação e configuração

### Requisitos

- [Node.js »](https://nodejs.org/en/download) na sua versão LTS
- Adicionar extensão [rest client »](https://github.com/Huachao/vscode-restclient), para realizar os testes de api dentro do projeto.
- Para permitir que o changelog rode automaticamente, verifique as configurações do repositório na aba Settings -> Actions -> General Workflow Permissions e marque a opção de permissões de leitura e escrita (Read and Write Permissions).

### Instalação

1. Clone o projeto: `git clone https://github.com/alexsandroferreira/fastify-node-api-template.git`.
2. Instale as dependências: `npm install`.
3. Crie um arquivo `.env` e cole o conteúdo do `.env.example`. 
4. Para iniciar a aplicação execute `npm run build` e `npm run start`.

## Licença

Projeto sob a licença [MIT »](/LICENSE)
