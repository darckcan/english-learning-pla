#!/bin/bash

echo "🚀 Preparando Nexus Fluent para EasyPanel..."
echo ""

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

# Compilar la aplicación
echo "🔨 Compilando aplicación..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error compilando la aplicación"
    exit 1
fi

# Verificar que dist/ existe
if [ ! -d "dist" ]; then
    echo "❌ Error: La carpeta dist/ no fue creada"
    exit 1
fi

echo ""
echo "✅ ¡Compilación exitosa!"
echo ""
echo "📂 Archivos listos en la carpeta: dist/"
echo ""
echo "📋 OPCIONES PARA SUBIR A EASYPANEL:"
echo ""
echo "Opción 1 - Subir carpeta dist/ completa:"
echo "   1. Ve a la carpeta dist/"
echo "   2. Selecciona TODOS los archivos dentro (index.html, assets/, etc.)"
echo "   3. Súbelos a EasyPanel como archivos estáticos"
echo "   4. Configura index.html como página principal"
echo ""
echo "Opción 2 - Usar GitHub:"
echo "   1. Sube todo el proyecto a GitHub"
echo "   2. En EasyPanel conecta tu repo"
echo "   3. Build Command: npm install && npm run build"
echo "   4. Start Command: npx serve -s dist -l 3000"
echo ""
echo "Opción 3 - Usar Docker:"
echo "   1. En EasyPanel selecciona Docker"
echo "   2. Dockerfile: Dockerfile.nginx"
echo "   3. Port: 80"
echo ""
echo "⚠️  IMPORTANTE: No subas solo index.html, necesitas TODA la carpeta dist/"
echo ""
