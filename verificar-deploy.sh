#!/bin/bash

# Script de verificación pre-deploy para EasyPanel
# Verifica que todos los archivos y configuraciones estén correctos

echo "🔍 VERIFICANDO PREPARACIÓN PARA EASYPANEL"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NO ENCONTRADO"
        ((errors++))
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directorio $1 existe"
        return 0
    else
        echo -e "${RED}✗${NC} Directorio $1 NO ENCONTRADO"
        ((errors++))
        return 1
    fi
}

echo "📁 Verificando archivos críticos..."
echo "-----------------------------------"
check_file "Dockerfile"
check_file "nginx.conf"
check_file ".dockerignore"
check_file "package.json"
check_file "index.html"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file "tailwind.config.js"
echo ""

echo "📂 Verificando estructura src/..."
echo "-----------------------------------"
check_dir "src"
check_dir "src/components"
check_dir "src/lib"
check_file "src/App.tsx"
check_file "src/index.css"
check_file "src/main.tsx"
check_file "src/lib/audio.ts"
check_file "src/lib/curriculum.ts"
check_file "src/lib/types.ts"
echo ""

echo "🔧 Verificando configuración de audio..."
echo "-----------------------------------"
if grep -q "pronounceWord" "src/lib/audio.ts" && \
   grep -q "pronounceSentence" "src/lib/audio.ts" && \
   grep -q "pronounceExample" "src/lib/audio.ts"; then
    echo -e "${GREEN}✓${NC} Métodos de audio implementados"
else
    echo -e "${RED}✗${NC} Faltan métodos de audio"
    ((errors++))
fi

if grep -q "type?: 'word' | 'sentence' | 'example'" "src/components/PronunciationButton.tsx"; then
    echo -e "${GREEN}✓${NC} PronunciationButton tiene prop type"
else
    echo -e "${YELLOW}⚠${NC} PronunciationButton puede estar desactualizado"
    ((warnings++))
fi
echo ""

echo "📚 Verificando currículo..."
echo "-----------------------------------"
if grep -q "shadowingPhrases" "src/lib/curriculum.ts"; then
    echo -e "${GREEN}✓${NC} shadowingPhrases implementado en curriculum"
else
    echo -e "${RED}✗${NC} shadowingPhrases no encontrado"
    ((errors++))
fi

# Check lesson files
lesson_files=(
    "src/lib/a1-lessons.ts"
    "src/lib/a2-complete-lessons.ts"
    "src/lib/complete-curriculum-data.ts"
    "src/lib/c1-complete-lessons.ts"
    "src/lib/c2-complete-lessons.ts"
)

for file in "${lesson_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file existe"
    else
        echo -e "${YELLOW}⚠${NC} $file no encontrado (puede ser opcional)"
        ((warnings++))
    fi
done
echo ""

echo "🐳 Verificando Dockerfile..."
echo "-----------------------------------"
if grep -q "FROM node:20-alpine AS builder" "Dockerfile"; then
    echo -e "${GREEN}✓${NC} Dockerfile usa node:20-alpine"
else
    echo -e "${RED}✗${NC} Dockerfile no usa la imagen correcta"
    ((errors++))
fi

if grep -q "FROM nginx:alpine" "Dockerfile"; then
    echo -e "${GREEN}✓${NC} Dockerfile usa nginx:alpine para producción"
else
    echo -e "${RED}✗${NC} Dockerfile no usa nginx"
    ((errors++))
fi

if grep -q "EXPOSE 80" "Dockerfile"; then
    echo -e "${GREEN}✓${NC} Puerto 80 expuesto"
else
    echo -e "${RED}✗${NC} Puerto 80 no configurado"
    ((errors++))
fi
echo ""

echo "🌐 Verificando nginx.conf..."
echo "-----------------------------------"
if grep -q "listen 80" "nginx.conf"; then
    echo -e "${GREEN}✓${NC} Nginx configurado en puerto 80"
else
    echo -e "${RED}✗${NC} Puerto en nginx.conf incorrecto"
    ((errors++))
fi

if grep -q "location /health" "nginx.conf"; then
    echo -e "${GREEN}✓${NC} Health check endpoint configurado"
else
    echo -e "${RED}✗${NC} Health check no configurado"
    ((errors++))
fi

if grep -q "gzip on" "nginx.conf"; then
    echo -e "${GREEN}✓${NC} Compresión gzip habilitada"
else
    echo -e "${YELLOW}⚠${NC} Compresión gzip no configurada"
    ((warnings++))
fi

if grep -q "try_files.*index.html" "nginx.conf"; then
    echo -e "${GREEN}✓${NC} SPA fallback configurado"
else
    echo -e "${RED}✗${NC} SPA fallback no configurado"
    ((errors++))
fi
echo ""

echo "📦 Verificando package.json..."
echo "-----------------------------------"
if grep -q '"build":.*"vite build"' "package.json"; then
    echo -e "${GREEN}✓${NC} Script de build configurado"
else
    echo -e "${RED}✗${NC} Script de build no encontrado"
    ((errors++))
fi

if grep -q '"react"' "package.json"; then
    echo -e "${GREEN}✓${NC} React instalado"
else
    echo -e "${RED}✗${NC} React no encontrado"
    ((errors++))
fi

if grep -q '"framer-motion"' "package.json"; then
    echo -e "${GREEN}✓${NC} Framer Motion instalado"
else
    echo -e "${YELLOW}⚠${NC} Framer Motion no encontrado"
    ((warnings++))
fi
echo ""

echo "🚫 Verificando .dockerignore..."
echo "-----------------------------------"
if grep -q "node_modules" ".dockerignore"; then
    echo -e "${GREEN}✓${NC} node_modules excluido"
else
    echo -e "${RED}✗${NC} node_modules no excluido"
    ((errors++))
fi

if grep -q ".git" ".dockerignore"; then
    echo -e "${GREEN}✓${NC} .git excluido"
else
    echo -e "${YELLOW}⚠${NC} .git no excluido"
    ((warnings++))
fi
echo ""

echo "📝 Verificando documentación..."
echo "-----------------------------------"
check_file "DEPLOY_EASYPANEL.md"
check_file "DEPLOY_READY.md"
echo ""

echo "=========================================="
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================================="
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODO PERFECTO!${NC}"
    echo "✅ 0 errores"
    echo "✅ 0 advertencias"
    echo ""
    echo -e "${GREEN}👍 Tu aplicación está 100% lista para deploy en EasyPanel${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Sube tu código a Git"
    echo "2. Crea un nuevo servicio en EasyPanel"
    echo "3. Selecciona 'Dockerfile' como método de build"
    echo "4. Configura el puerto 80"
    echo "5. Deploy!"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ HAY ADVERTENCIAS${NC}"
    echo "✅ 0 errores"
    echo "⚠ $warnings advertencias"
    echo ""
    echo -e "${YELLOW}La aplicación debería funcionar, pero revisa las advertencias${NC}"
    exit 0
else
    echo -e "${RED}❌ HAY ERRORES${NC}"
    echo "❌ $errors errores"
    echo "⚠ $warnings advertencias"
    echo ""
    echo -e "${RED}Corrige los errores antes de hacer deploy${NC}"
    exit 1
fi
