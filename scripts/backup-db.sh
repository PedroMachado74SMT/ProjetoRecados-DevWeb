
#!/usr/bin/env bash
set -euo pipefail

# Executar na raiz do projeto
cd "$(dirname "$0")/.."

# Criar pasta para os backups
mkdir -p backups

# Nome do arquivo com data e hora
DATA=$(date +"%Y-%m-%d_%H-%M-%S")
ARQUIVO="backups/recados_$DATA.sql"

echo "Iniciando backup do MySQL..."

if docker compose exec -T mysql sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -uroot --single-transaction --no-tablespaces recados' > "$ARQUIVO"; then
    echo "Backup criado: $ARQUIVO"
else
    rm -f "$ARQUIVO"
    echo "Erro ao criar backup."
    exit 1
fi
