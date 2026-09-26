# 📌 Projeto Recados

Projeto Full Stack desenvolvido para a disciplina de Desenvolvimento Web III da FATEC.

O sistema permite que usuários realizem cadastro, login e gerenciamento de recados pessoais através de uma API REST desenvolvida em Laravel e um Front-end desenvolvido em React.

O projeto também utiliza autenticação com Laravel Sanctum, banco de dados MySQL e uma API externa para exibição do clima atual.

---

# 🛠 Tecnologias Utilizadas

## Front-end

- React
- Vite
- Axios
- React Router DOM
- CSS

## Back-end

- Laravel 13
- Laravel Sanctum
- PHP 8.4
- Composer

## Banco de Dados

- MySQL
- XAMPP
- Eloquent ORM
- Migrations

## API Externa

- Open-Meteo API

## Controle de Versão

- Git
- GitHub

---

# 📂 Estrutura do Projeto

```text
ProjetoRecados/
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

# 📋 Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

- XAMPP
- PHP 8.4 ou superior compatível com o projeto
- Composer
- Node.js
- npm
- Git

O MySQL utilizado no desenvolvimento é o disponibilizado pelo XAMPP.

---

# 📥 Clonando o Projeto

Clone o repositório:

```bash
git clone https://github.com/Duda26817/ProjetoRecados.git
```

Entre na pasta do projeto:

```bash
cd ProjetoRecados
```

---

# 🗄️ Configuração do Banco de Dados

1. Abra o **XAMPP Control Panel**.

2. Inicie o serviço **MySQL**.

3. Acesse o phpMyAdmin:

```text
http://localhost/phpmyadmin
```

4. Crie um banco de dados chamado:

```text
recados
```

---

# ⚙️ Configuração do Backend

Abra um terminal e entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
composer install
```

Crie o arquivo `.env` a partir do `.env.example`:

```bash
copy .env.example .env
```

Gere a chave da aplicação:

```bash
php artisan key:generate
```

Configure no arquivo `.env` as informações do banco:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recados
DB_USERNAME=root
DB_PASSWORD=
```

Para o funcionamento da autenticação, também são utilizadas as configurações de sessão e Sanctum presentes no projeto.

Execute as migrations:

```bash
php artisan migrate
```

Inicie o servidor Laravel:

```bash
php artisan serve
```

O backend ficará disponível em:

```text
http://localhost:8000
```

---

# ⚛️ Configuração do Front-end

Abra outro terminal.

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O front-end ficará disponível em:

```text
http://localhost:5173
```

---

# ✨ Funcionalidades

## 👤 Usuários

- Cadastro de usuário
- Login
- Logout
- Autenticação utilizando Laravel Sanctum
- Rotas protegidas
- Controle de sessão por cookies
- Acesso restrito aos dados do usuário autenticado

## 📝 Recados

- Cadastro de recados
- Listagem de recados
- Edição de recados
- Exclusão de recados
- Exibição da data de criação
- Atualização da lista sem recarregar a página
- Cada usuário acessa somente seus próprios recados

## 🌤️ Clima

O sistema consome a API pública **Open-Meteo** para apresentar a temperatura atual na tela principal.

A consulta é realizada diretamente pelo Front-end através da API externa.

---

# 🔐 Autenticação

A autenticação da aplicação utiliza **Laravel Sanctum**.

O projeto utiliza o modelo de autenticação para aplicações SPA, utilizando sessão e cookies.

O Front-end envia as requisições com credenciais habilitadas e o Laravel realiza o controle da sessão do usuário.

Não é utilizado `localStorage` para armazenar tokens de autenticação.

As rotas protegidas utilizam o middleware:

```php
auth:sanctum
```

Dessa forma, somente usuários autenticados podem acessar os recados.

---

# 🔗 Rotas da API

## 👤 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/register` | Cadastrar usuário |
| POST | `/api/login` | Realizar login |
| GET | `/api/user` | Obter usuário autenticado |
| POST | `/api/logout` | Realizar logout |

## 📝 Recados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/recados` | Listar recados do usuário |
| POST | `/api/recados` | Criar recado |
| PUT | `/api/recados/{id}` | Editar recado |
| DELETE | `/api/recados/{id}` | Excluir recado |

---

# 🌤️ API Externa

O projeto utiliza a **Open-Meteo API** para consultar informações meteorológicas.

A aplicação realiza uma requisição para obter a temperatura atual e apresenta o resultado na tela principal.

Exemplo de informação apresentada:

```text
🌤️ Sumaré: 30.8°C
```

A utilização da API externa foi escolhida para demonstrar a integração do Front-end com um serviço externo de dados.

A Open-Meteo não exige uma chave de API para essa utilização.

---

# 🗃️ Banco de Dados

O sistema utiliza MySQL para persistência dos dados.

As tabelas são criadas e atualizadas através das migrations do Laravel.

Principais tabelas utilizadas:

- `users`
- `recados`
- `personal_access_tokens`
- `cache`
- `jobs`

Os recados possuem relacionamento com o usuário responsável através do campo:

```text
user_id
```

Isso permite garantir que cada usuário visualize e manipule somente seus próprios recados.

---

# ▶️ Primeira Execução

Após clonar o projeto:

### 1. Inicie o MySQL

Abra o XAMPP e inicie:

```text
MySQL
```

### 2. Crie o banco

No phpMyAdmin, crie:

```text
recados
```

### 3. Configure o Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 4. Configure o Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

### 5. Acesse o sistema

Abra:

```text
http://localhost:5173
```

### 6. Utilize o sistema

1. Crie uma conta.
2. Faça login.
3. Crie um recado.
4. Edite ou exclua o recado.
5. Verifique a temperatura exibida na tela inicial.
6. Realize logout.

---

# 📱 Responsividade

A interface possui estilos responsivos para permitir a utilização em diferentes tamanhos de tela.

Em telas menores, os elementos do formulário e os botões são reorganizados para facilitar a utilização em dispositivos móveis.

---

# 📷 Funcionalidades Implementadas

- ✅ Cadastro de usuário
- ✅ Login
- ✅ Logout
- ✅ Autenticação com Laravel Sanctum
- ✅ Sessão utilizando cookies
- ✅ Rotas protegidas
- ✅ Cadastro de recados
- ✅ Listagem de recados
- ✅ Edição de recados
- ✅ Exclusão de recados
- ✅ Exibição da data dos recados
- ✅ CRUD completo
- ✅ Banco de dados MySQL
- ✅ Migrations
- ✅ API REST
- ✅ Integração com API externa
- ✅ Consulta de clima
- ✅ Interface responsiva

---

# 👨‍💻 Integrantes

- Maria Eduarda Silva Rocha
- Pedro Henrique Machado Mantovani

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Desenvolvimento Web III da FATEC.