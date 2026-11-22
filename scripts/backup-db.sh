
#!/usr/bin/env bash
set -euo pipefail

# Ir para a raiz do projeto
cd "$(dirname "$0")/.."

# Criar pasta dos backups
mkdir -p backups

DATA=$(date +"%Y-%m-%d_%H-%M-%S")
ARQUIVO="backups/recados_$DATA.sql"

echo "Iniciando backup do MySQL..."

# Exportar o banco de dados
if ! docker compose exec -T mysql sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -uroot --single-transaction --no-tablespaces recados' > "$ARQUIVO"; then
    rm -f "$ARQUIVO"
    echo "ERRO: não foi possível criar o backup."
    exit 1
fi

echo "Verificando o backup..."

# Conferir se o arquivo não está vazio
if [[ ! -s "$ARQUIVO" ]]; then
    echo "ERRO: o arquivo de backup está vazio."
    rm -f "$ARQUIVO"
    exit 1
fi

# Conferir as tabelas principais
for TABELA in users recados; do
    if ! grep -Fq "CREATE TABLE \`$TABELA\`" "$ARQUIVO"; then
        echo "ERRO: tabela $TABELA não encontrada no backup."
        rm -f "$ARQUIVO"
        exit 1
    fi
done

echo "Backup gerado e estrutura básica verificada!"
echo "Arquivo: $ARQUIVO"
