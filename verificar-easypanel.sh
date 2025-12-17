#!/bin/bash

# Script de verificación pre-deploy para EasyPanel
# Verifica que todos los archivos necesarios estén presentes

echo "🔍 Verificando configuración de EasyPanel..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0
WARNINGS=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 encontrado"
    else
        echo -e "${RED}✗${NC} $1 NO encontrado"
        ((ERRORS++))
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directorio $1 encontrado"
    else
        echo -e "${RED}✗${NC} Directorio $1 NO encontrado"
        ((ERRORS++))
    fi
}

echo "📋 Verificando archivos de configuración..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "Dockerfile"
check_file "nginx.conf"
check_file ".dockerignore"
check_file ".easypanel"
check_file "package.json"
check_file "vite.config.ts"
check_file "index.html"

echo ""
echo "📁 Verificando estructura de directorios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_dir "src"
check_dir "src/components"
check_dir "src/lib"
check_dir "src/hooks"
check_dir "packages"

echo ""
echo "🔧 Verificando configuración de Dockerfile..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "FROM node:20-alpine AS builder" Dockerfile; then
    echo -e "${GREEN}✓${NC} Build stage configurado correctamente"
else
    echo -e "${RED}✗${NC} Build stage no encontrado en Dockerfile"
    ((ERRORS++))
fi

if grep -q "FROM nginx:alpine" Dockerfile; then
    echo -e "${GREEN}✓${NC} Production stage con nginx configurado"
else
    echo -e "${RED}✗${NC} Production stage con nginx no encontrado"
    ((ERRORS++))
fi

if grep -q "EXPOSE 80" Dockerfile; then
    echo -e "${GREEN}✓${NC} Puerto 80 expuesto correctamente"
else
    echo -e "${YELLOW}⚠${NC} Puerto 80 no expuesto (puede causar problemas)"
    ((WARNINGS++))
fi

echo ""
echo "🌐 Verificando configuración de nginx..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "listen 80" nginx.conf; then
    echo -e "${GREEN}✓${NC} Nginx configurado para puerto 80"
else
    echo -e "${RED}✗${NC} Nginx no configurado para puerto 80"
    ((ERRORS++))
fi

if grep -q "/health" nginx.conf; then
    echo -e "${GREEN}✓${NC} Health check endpoint configurado"
else
    echo -e "${RED}✗${NC} Health check endpoint no configurado"
    ((ERRORS++))
fi

if grep -q "try_files.*index.html" nginx.conf; then
    echo -e "${GREEN}✓${NC} SPA fallback configurado"
else
    echo -e "${RED}✗${NC} SPA fallback no configurado"
    ((ERRORS++))
fi

echo ""
echo "📦 Verificando package.json..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q '"build"' package.json; then
    echo -e "${GREEN}✓${NC} Script de build encontrado"
else
    echo -e "${RED}✗${NC} Script de build no encontrado"
    ((ERRORS++))
fi

if grep -q '"vite"' package.json; then
    echo -e "${GREEN}✓${NC} Vite como dependencia"
else
    echo -e "${RED}✗${NC} Vite no encontrado en dependencias"
    ((ERRORS++))
fi

echo ""
echo "🔍 Verificando .dockerignore..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "node_modules" .dockerignore; then
    echo -e "${GREEN}✓${NC} node_modules ignorado"
else
    echo -e "${YELLOW}⚠${NC} node_modules no ignorado (build será más lento)"
    ((WARNINGS++))
fi

if grep -q "dist" .dockerignore; then
    echo -e "${GREEN}✓${NC} dist ignorado"
else
    echo -e "${YELLOW}⚠${NC} dist no ignorado (puede causar conflictos)"
    ((WARNINGS++))
fi

if grep -q ".git" .dockerignore; then
    echo -e "${GREEN}✓${NC} .git ignorado"
else
    echo -e "${YELLOW}⚠${NC} .git no ignorado (build será más lento)"
    ((WARNINGS++))
fi

echo ""
echo "📊 Resumen..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ ¡Todo perfecto! El proyecto está listo para deploy en EasyPanel${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Commit y push de los cambios"
    echo "2. Conectar repositorio en EasyPanel"
    echo "3. Seleccionar 'Dockerfile' como método de build"
    echo "4. Configurar puerto 80"
    echo "5. Deploy!"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ El proyecto tiene $WARNINGS advertencia(s) pero debería funcionar${NC}"
    echo "Considera revisar las advertencias antes de hacer deploy."
    exit 0
else
    echo -e "${RED}✗ El proyecto tiene $ERRORS error(es) y $WARNINGS advertencia(s)${NC}"
    echo "Por favor corrige los errores antes de hacer deploy."
    exit 1
fi
