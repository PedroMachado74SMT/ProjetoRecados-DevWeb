# 📌 Projeto Recados

Projeto Full Stack desenvolvido para a disciplina de Desenvolvimento Web III da FATEC.

O sistema permite que usuários realizem cadastro, login e gerenciamento de recados pessoais através de uma API REST desenvolvida em Laravel e um Front-end em React.

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

- MySQL (XAMPP)

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

- XAMPP (Apache e MySQL)
- PHP 8.5 (caso não utilize o PHP do XAMPP)
- Composer
- Node.js
- npm
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

1. Abra o **XAMPP Control Panel**.

2. Inicie o serviço **MySQL**.

3. Acesse o **phpMyAdmin**:

```
http://localhost/phpmyadmin
```

4. Crie um banco de dados chamado:

```
recados
```

---

# ⚙️ Configuração do Backend

Abra um terminal.

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
composer install
```

Caso seja necessário instalar as rotas da API:

```bash
php artisan install:api
```

Execute as migrations:

```bash
php artisan migrate
```

Inicie o servidor Laravel:

```bash
php artisan serve
```

O Backend ficará disponível em:

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

Execute:

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
- Autenticação utilizando Laravel Sanctum
- Rotas protegidas

## Recados

- Cadastro de recados
- Listagem de recados
- Edição de recados
- Exclusão de recados

---

# 📌 Principais Recursos

- Cadastro de usuários
- Login seguro utilizando Token
- Logout
- CRUD completo de recados
- Cada usuário possui acesso apenas aos seus próprios recados
- API REST utilizando Laravel
- Front-end desenvolvido em React

---

# 🔗 Rotas da API

## Usuários

| Método | Endpoint |
|---------|----------|
| POST | /api/register |
| POST | /api/login |
| POST | /api/logout |

## Recados

| Método | Endpoint |
|---------|----------|
| GET | /api/recados |
| POST | /api/recados |
| PUT | /api/recados/{id} |
| DELETE | /api/recados/{id} |

---

# 🔐 Autenticação

A autenticação é realizada utilizando o **Laravel Sanctum**.

Após realizar o login, a API retorna um Token.

Esse Token deve ser enviado nas rotas protegidas utilizando o Header:

```http
Authorization: Bearer SEU_TOKEN
```

---

# ▶️ Primeira Execução

1. Abra o **XAMPP Control Panel**.
2. Inicie o **MySQL**.
3. Crie o banco de dados **recados** no phpMyAdmin.
4. Abra um terminal e entre na pasta **backend**.
5. Execute:

```bash
composer install
```

6. Execute:

```bash
php artisan migrate
```

7. Execute:

```bash
php artisan serve
```

8. Abra outro terminal e entre na pasta **frontend**.

9. Execute:

```bash
npm install
```

10. Execute:

```bash
npm run dev
```

11. Abra o navegador:

```
http://localhost:5173
```

12. Cadastre um usuário.

13. Faça Login.

14. Utilize normalmente o sistema.

---

# 📷 Funcionalidades Implementadas

- ✅ Cadastro de Usuário
- ✅ Login
- ✅ Logout
- ✅ Cadastro de Recados
- ✅ Listagem de Recados
- ✅ Edição de Recados
- ✅ Exclusão de Recados
- ✅ Autenticação com Laravel Sanctum
- ✅ Rotas Protegidas
- ✅ CRUD Completo

---

# 👨‍💻 Integrantes

- Maria Eduarda Silva Rocha
- Pedro Henrique Machado Mantovani

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Desenvolvimento Web III da FATEC.
