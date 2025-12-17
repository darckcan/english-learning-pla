#!/bin/bash

echo "🔍 VERIFICACIÓN DEL SISTEMA NEXUS FLUENT"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para check
check_ok() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar archivos de configuración
echo "📁 Verificando archivos de configuración..."

if [ -f "nixpacks.toml" ]; then
    check_ok "nixpacks.toml encontrado"
else
    check_error "nixpacks.toml NO encontrado"
fi

if [ -f "package.json" ]; then
    check_ok "package.json encontrado"
else
    check_error "package.json NO encontrado"
fi

if [ -f ".env.example" ]; then
    check_ok ".env.example encontrado"
else
    check_warning ".env.example NO encontrado"
fi

echo ""

# 2. Verificar scripts en package.json
echo "📋 Verificando scripts de NPM..."

if grep -q '"start".*"vite preview --host 0.0.0.0 --port 80"' package.json; then
    check_ok "Script 'start' configurado para puerto 80"
else
    check_error "Script 'start' NO configurado correctamente"
fi

if grep -q '"build"' package.json; then
    check_ok "Script 'build' encontrado"
else
    check_error "Script 'build' NO encontrado"
fi

echo ""

# 3. Verificar componentes críticos
echo "🔧 Verificando componentes críticos..."

if [ -f "src/components/WelcomeScreen.tsx" ]; then
    if grep -q "existingUser" src/components/WelcomeScreen.tsx; then
        check_ok "Validación de usuarios duplicados implementada"
    else
        check_error "Validación de usuarios NO encontrada"
    fi
else
    check_error "WelcomeScreen.tsx NO encontrado"
fi

if [ -f "src/lib/stripe-config.ts" ]; then
    if grep -q "VITE_STRIPE_PUBLIC_KEY" src/lib/stripe-config.ts; then
        check_ok "Configuración de Stripe usando variables de entorno"
    else
        check_warning "Stripe NO configurado con variables de entorno"
    fi
else
    check_warning "stripe-config.ts NO encontrado"
fi

echo ""

# 4. Verificar estructura de directorios
echo "📂 Verificando estructura del proyecto..."

if [ -d "src/components" ]; then
    check_ok "Directorio src/components existe"
else
    check_error "Directorio src/components NO existe"
fi

if [ -d "src/lib" ]; then
    check_ok "Directorio src/lib existe"
else
    check_error "Directorio src/lib NO existe"
fi

if [ -d "src/hooks" ]; then
    check_ok "Directorio src/hooks existe"
else
    check_error "Directorio src/hooks NO existe"
fi

echo ""

# 5. Verificar dependencias
echo "📦 Verificando dependencias..."

if [ -d "node_modules" ]; then
    check_ok "node_modules existe - dependencias instaladas"
else
    check_warning "node_modules NO existe - ejecuta 'npm install'"
fi

echo ""

# 6. Verificar configuración de nixpacks
echo "⚙️  Verificando configuración de Nixpacks..."

if grep -q "nodejs_20" nixpacks.toml; then
    check_ok "Node.js 20 configurado"
else
    check_error "Node.js NO configurado correctamente"
fi

if grep -q "npm run start" nixpacks.toml; then
    check_ok "Comando de inicio configurado"
else
    check_error "Comando de inicio NO configurado"
fi

if grep -q 'PORT = "80"' nixpacks.toml; then
    check_ok "Puerto 80 configurado en nixpacks.toml"
else
    check_error "Puerto 80 NO configurado"
fi

echo ""

# 7. Verificar archivos de despliegue
echo "🚀 Verificando archivos de despliegue..."

if [ -f "GUIA_EASYPANEL_USUARIOS.md" ]; then
    check_ok "Guía de Easy Panel disponible"
else
    check_warning "Guía de Easy Panel NO encontrada"
fi

if [ -f "VERIFICACION_COMPLETA.md" ]; then
    check_ok "Documento de verificación disponible"
else
    check_warning "Documento de verificación NO encontrado"
fi

echo ""
echo "========================================"
echo "✅ VERIFICACIÓN COMPLETA"
echo ""
echo "📖 Para desplegar en Easy Panel:"
echo "   Lee: GUIA_EASYPANEL_USUARIOS.md"
echo ""
echo "🔍 Para más detalles:"
echo "   Lee: VERIFICACION_COMPLETA.md"
echo ""
echo "🚀 Siguiente paso:"
echo "   1. Configura variables de entorno en Easy Panel"
echo "   2. Conecta tu repositorio Git"
echo "   3. Selecciona Nixpacks como método de build"
echo "   4. Deploy!"
echo ""
