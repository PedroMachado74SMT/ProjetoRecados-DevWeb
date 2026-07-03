# 📌 Projeto Recados

Projeto Full Stack desenvolvido para a disciplina de Desenvolvimento Web III da FATEC.

O sistema permite o cadastro de usuários e o gerenciamento de recados utilizando uma API desenvolvida em Laravel e um Front-end em React.

---

# 🛠 Tecnologias Utilizadas

## Front-end

- React
- Vite
- Axios
- React Router DOM

## Back-end

- Laravel 13
- Laravel Sanctum
- PHP 8.5

## Banco de Dados

- MySQL

---

# 📂 Estrutura do Projeto

```
ProjetoRecados/
│
├── backend/
├── frontend/
└── README.md
```

---

# 📋 Pré-requisitos

Antes de executar o projeto é necessário possuir instalado:

- PHP 8.5 ou superior
- Composer
- Node.js
- npm
- MySQL (XAMPP ou MySQL Server)
- Git

---

# 📥 Clonando o Projeto

```bash
git clone https://github.com/SEU-USUARIO/ProjetoRecados.git
```

Entre na pasta do projeto:

```bash
cd ProjetoRecados
```

---

# ⚙️ Configuração do Banco de Dados

1. Inicie o MySQL.

2. Crie um banco de dados chamado:

```
recados
```

---

# ⚙️ Configuração do Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
composer install
```

Execute as migrations:

```bash
php artisan migrate
```

Caso seja necessário instalar as rotas da API:

```bash
php artisan install:api
```

Inicie o servidor:

```bash
php artisan serve
```

O backend ficará disponível em:

```
http://127.0.0.1:8000
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

O Front-end ficará disponível em:

```
http://localhost:5173
```

---

# ✨ Funcionalidades

## Usuários

- Cadastro de usuário
- Login
- Logout
- Autenticação com Laravel Sanctum
- Rotas protegidas

## Recados

- Cadastro de recados
- Listagem de recados
- Exclusão de recados

> O projeto ainda está em desenvolvimento e novas funcionalidades poderão ser adicionadas.

---

# 🔗 Rotas da API

## Usuários

| Método | Rota |
|---------|------|
| POST | /api/register |
| POST | /api/login |
| POST | /api/logout |

## Recados

| Método | Rota |
|---------|------|
| GET | /api/recados |
| POST | /api/recados |
| DELETE | /api/recados/{id} |

---

# 🔐 Autenticação

A autenticação é realizada utilizando **Laravel Sanctum**.

Após o login, a API retorna um Token que deve ser enviado nas requisições protegidas.

Header:

```http
Authorization: Bearer SEU_TOKEN
```

---

# ▶️ Primeira Execução

1. Inicie o MySQL.
2. Crie o banco `recados`.
3. Execute `composer install`.
4. Execute `php artisan migrate`.
5. Execute `php artisan serve`.
6. Execute `npm install`.
7. Execute `npm run dev`.
8. Cadastre um usuário.
9. Faça login.
10. Utilize normalmente o sistema.

---

# 👨‍💻 Integrantes

- Maria Eduarda Silva Rocha
- Pedro Henrique Machado Mantovani

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Desenvolvimento Web III da FATEC.
