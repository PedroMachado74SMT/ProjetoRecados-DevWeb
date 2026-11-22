# 📌 Projeto Recados

Sistema Full Stack desenvolvido para a disciplina de **Desenvolvimento Web III da FATEC**.

A aplicação permite cadastrar usuários, realizar login e gerenciar recados pessoais com anexos. Também possui um painel administrativo para moderação dos recados.

## 🛠 Tecnologias utilizadas

**Frontend:** React, Vite, Axios e React Router DOM.

**Backend:** Laravel 13, PHP 8.4 e Laravel Sanctum.

**Banco de dados:** MySQL 8.0.

**Infraestrutura:** Docker, Docker Compose e volumes persistentes.

## ✨ Funcionalidades

- Cadastro, login e logout de usuários.
- Autenticação por sessão com Laravel Sanctum.
- CRUD de recados pessoais.
- Upload de um anexo por recado.
- Download de anexos privados.
- Suporte a JPG, JPEG, PNG, WEBP e PDF.
- Limite de 5 MB por anexo.
- Controle de acesso por papéis (`user` e `admin`).
- Painel administrativo para visualizar todos os recados.
- Integração com a API pública Open-Meteo.
- Proteção de rotas, senhas com hash e validação de entradas.
- Backup do banco de dados com script Bash.

## 📂 Estrutura do projeto

```text
ProjetoRecados-DevWeb/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   └── Dockerfile
├── scripts/
│   └── backup-db.sh
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Instalação com Docker

### Pré-requisitos

- Git
- Docker com suporte ao Docker Compose

Não é necessário instalar PHP, Composer, Node.js ou MySQL separadamente para utilizar o Docker.

### 1. Clonar o repositório

```bash
git clone https://github.com/PedroMachado74SMT/ProjetoRecados-DevWeb.git
cd ProjetoRecados-DevWeb
```

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto, utilizando `.env.example` como referência.

No Linux ou Codespaces:

```bash
cp .env.example .env
```

Configure as seguintes variáveis:

```dotenv
APP_KEY=base64:COLOQUE_SUA_CHAVE_AQUI
DB_PASSWORD=COLOQUE_UMA_SENHA_FORTE
MYSQL_ROOT_PASSWORD=COLOQUE_OUTRA_SENHA_FORTE
```

Para gerar uma chave de aplicação:

```bash
docker run --rm php:8.4-cli php -r 'echo "base64:".base64_encode(random_bytes(32)).PHP_EOL;'
```

Copie o resultado para `APP_KEY`.

**Importante:** nunca publique o arquivo `.env` nem compartilhe senhas ou chaves de criptografia.

### 3. Iniciar a aplicação

Na raiz do projeto:

```bash
docker compose up -d --build
```

O Docker Compose inicia MySQL, Laravel e React.

As migrations são executadas automaticamente durante a inicialização do backend.

### 4. Verificar os serviços

```bash
docker compose ps
```

O MySQL e o backend possuem verificações de saúde (*healthchecks*).

### 5. Acessar o sistema

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

Cadastre um usuário pela interface para começar a utilizar o sistema.

## 👤 Administrador

Por segurança, novos usuários recebem o papel `user` por padrão.

Para conceder permissão administrativa a uma conta existente, execute:

```bash
docker compose exec backend php artisan tinker
```

No Tinker, substitua o e-mail abaixo pelo e-mail da conta desejada:

```php
\App\Models\User::where('email', 'admin@exemplo.com')
    ->update(['role' => 'admin']);
```

Digite `exit` para sair.

Após entrar novamente na aplicação, esse usuário poderá acessar o painel administrativo.

A permissão de administrador não pode ser escolhida livremente durante o cadastro.

## 📎 Anexos

Cada recado pode possuir um anexo.

Formatos permitidos: JPG, JPEG, PNG, WEBP e PDF.

Tamanho máximo: **5 MB**.

Os arquivos ficam em armazenamento privado do Laravel, utilizando um volume persistente do Docker.

O proprietário pode baixar seu próprio anexo. Administradores também podem baixar anexos de outros usuários para fins de moderação.

## 🔐 Segurança

A aplicação utiliza:

- Laravel Sanctum com autenticação por cookies e sessões.
- Cookies de sessão com `HttpOnly`.
- Proteção CSRF para requisições de sessão.
- Hash de senhas.
- Validação de dados enviados à API.
- Controle de acesso por usuário e administrador.
- Consultas utilizando Eloquent.
- Armazenamento privado de anexos.
- Variáveis de ambiente para credenciais e chaves.

O frontend não precisa armazenar tokens de autenticação no `localStorage`.

## 🔗 Principais rotas da API

| Método | Endpoint | Função |
|---|---|---|
| POST | `/api/register` | Cadastro |
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Usuário autenticado |
| GET | `/api/recados` | Listar recados próprios |
| POST | `/api/recados` | Criar recado |
| PUT | `/api/recados/{id}` | Editar recado |
| DELETE | `/api/recados/{id}` | Excluir recado |
| POST | `/api/recados/{id}/anexo` | Enviar anexo |
| GET | `/api/recados/{id}/anexo` | Baixar anexo |
| GET | `/api/admin/recados` | Listar todos os recados (admin) |

As rotas protegidas exigem autenticação. A rota administrativa exige também o papel `admin`.

## 🧪 Testes automatizados

O backend possui testes de autenticação, permissões administrativas, recados, anexos e validação de arquivos.

Para executar todos os testes:

```bash
docker compose exec backend php artisan test
```

Na última execução completa realizada durante o desenvolvimento:

**19 testes aprovados e 42 verificações, sem falhas.**

Os testes utilizam SQLite em memória, configurado em `backend/phpunit.xml`.

## 💾 Persistência dos dados

O Docker Compose utiliza volumes para preservar os dados:

- `mysql_data`: dados do MySQL.
- `anexos_data`: arquivos anexados aos recados.

Para parar os serviços sem remover os volumes:

```bash
docker compose down
```

**Atenção:** não utilize `docker compose down -v` se desejar preservar os dados.

## 💾 Backup do banco de dados

O projeto possui um script Bash que gera backups do MySQL.

Para criar um backup, execute na raiz do projeto, com os serviços Docker em funcionamento:

```bash
bash scripts/backup-db.sh
```

O script realiza as seguintes operações:

- Exporta o banco de dados `recados`.
- Salva um arquivo SQL na pasta `backups/`.
- Adiciona data e hora ao nome do arquivo.
- Verifica se o backup foi criado e não está vazio.
- Confere a presença das definições das tabelas `users` e `recados`.

Exemplo de saída:

```text
Iniciando backup do MySQL...
Verificando o backup...
Backup gerado e estrutura básica verificada!
Arquivo: backups/recados_2026-11-22_18-24-26.sql
```

A pasta `backups/` está incluída no `.gitignore`, evitando que os arquivos sejam adicionados acidentalmente ao repositório.

**Importante:** os backups podem conter informações pessoais e hashes de senhas. Eles devem ser armazenados em local seguro e não devem ser publicados no GitHub.

### Limitações do backup

A verificação realizada pelo script é básica e não substitui um teste completo de restauração.

O arquivo SQL contém os dados do MySQL, mas **não inclui os arquivos anexados aos recados**, que ficam em um volume separado.

Portanto, para preservar todos os dados da aplicação, é necessário manter cópias tanto do banco de dados quanto do armazenamento de anexos.

### Restauração de dados

A restauração de um backup deve ser realizada com cuidado, verificando previamente a compatibilidade das tabelas e a existência de registros no banco de destino.

Antes de restaurar dados, recomenda-se:

- Fazer uma cópia de segurança do banco atual.
- Conferir o conteúdo do SQL.
- Utilizar um banco de teste para validar a restauração.
- Evitar sobrescrever registros existentes.
- Preservar os arquivos de anexos separadamente.

## 🔧 Comandos úteis

Verificar os containers:

```bash
docker compose ps
```

Consultar os logs do backend:

```bash
docker compose logs --tail=50 backend
```

Conferir as migrations:

```bash
docker compose exec backend php artisan migrate:status
```

Reconstruir a aplicação:

```bash
docker compose up -d --build
```

Executar todos os testes:

```bash
docker compose exec backend php artisan test
```

Criar um backup:

```bash
bash scripts/backup-db.sh
```

## 👨‍💻 Integrantes

- Maria Eduarda Silva Rocha
- Pedro Henrique Machado Mantovani

## 📄 Finalidade

Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web III da FATEC.