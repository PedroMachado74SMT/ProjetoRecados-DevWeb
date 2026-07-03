# 📌 Cadastro e Lista de Recados

Projeto desenvolvido para a disciplina de Desenvolvimento Web III (FATEC).

---

# Tecnologias

## Front-end

- React
- Vite
- Axios

## Back-end

- Laravel 13
- Laravel Sanctum
- PHP 8.5

## Banco de Dados

- MySQL

---

# Estrutura do Projeto

```
ProjetoRecados/

│

├── frontend/

├── backend/

└── README.md
```

---

# Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js 20+
- PHP 8.2 ou superior
- Composer
- MySQL
- Git

---

# Clonar o projeto

```bash
git clone https://github.com/SEU-USUARIO/ProjetoRecados.git
```

Entre na pasta:

```bash
cd ProjetoRecados
```

---

# Configurando o Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
composer install
```

Crie o arquivo .env:

Windows

```cmd
copy .env.example .env
```

Linux/Mac

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure o banco de dados:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recados
DB_USERNAME=root
DB_PASSWORD=
```

Gere a chave da aplicação:

```bash
php artisan key:generate
```

Execute as migrations:

```bash
php artisan migrate
```

Inicie o servidor:

```bash
php artisan serve
```

O backend estará disponível em:

```
http://127.0.0.1:8000
```

---

# Configurando o Frontend

Abra outro terminal.

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

O frontend estará disponível em:

```
http://localhost:5173
```

---

# Funcionalidades

enquanto eu escrevo isso ainda não tem

- Cadastro de usuário
- Login
- Logout
- Rotas protegidas
- Listagem de recados
- Cadastro de recados
- Exclusão de recados

---

# API

## Autenticação

POST

```
/api/register
```

POST

```
/api/login
```

POST

```
/api/logout
```

---

## Recados

GET

```
/api/recados
```

POST

```
/api/recados
```

DELETE

```
/api/recados/{id}
```

---

# Integrantes

- Nome Maria Eduarda Silva Rocha
- Nome Pedro Henrique Machado Mantovani

---

# Observações

Caso o projeto seja executado pela primeira vez:

1. Configure o banco MySQL.
2. Execute as migrations.
3. Faça um cadastro.
4. Faça login.
5. Utilize normalmente o sistema.