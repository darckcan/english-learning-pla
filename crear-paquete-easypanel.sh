#!/bin/bash

echo "📦 Creando paquete para EasyPanel..."
echo ""

# Compilar la aplicación
echo "🔨 Compilando aplicación..."
npm install && npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación"
    exit 1
fi

# Verificar que dist existe
if [ ! -d "dist" ]; then
    echo "❌ La carpeta dist/ no existe"
    exit 1
fi

# Crear carpeta de empaquetado
rm -rf easypanel-package
mkdir -p easypanel-package

# Copiar archivos compilados
echo "📂 Copiando archivos..."
cp -r dist/* easypanel-package/

# Crear archivo .htaccess para Apache (SPA routing)
cat > easypanel-package/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOF

# Crear archivo de configuración Nginx
cat > easypanel-package/nginx.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Crear README con instrucciones
cat > easypanel-package/README_INSTRUCCIONES.txt << 'EOF'
📦 PAQUETE NEXUS FLUENT PARA EASYPANEL

Este paquete contiene los archivos compilados de Nexus Fluent.

🚀 CÓMO SUBIR A EASYPANEL:

Opción 1: Si EasyPanel soporta archivos estáticos
1. Sube TODOS los archivos de esta carpeta a EasyPanel
2. Configura index.html como archivo principal
3. Si usa Apache: el archivo .htaccess ya está incluido
4. Si usa Nginx: usa la configuración en nginx.conf

Opción 2: Si EasyPanel soporta GitHub
NO uses este paquete. En su lugar:
1. Sube el proyecto completo a GitHub
2. Conecta EasyPanel con GitHub
3. Build: npm install && npm run build
4. Start: npx serve -s dist -l 3000

⚠️ IMPORTANTE:
- Sube TODOS los archivos, no solo index.html
- La carpeta assets/ es necesaria
- Configura SPA routing (ver .htaccess o nginx.conf)

📞 Si tienes problemas, lee: LEEME_EASYPANEL.md
EOF

# Crear ZIP
echo "🗜️  Creando archivo ZIP..."
cd easypanel-package
zip -r ../nexus-fluent-easypanel.zip * .htaccess
cd ..

# Limpiar
rm -rf easypanel-package

echo ""
echo "✅ ¡Paquete creado exitosamente!"
echo ""
echo "📦 Archivo: nexus-fluent-easypanel.zip"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Extrae el archivo nexus-fluent-easypanel.zip"
echo "2. Sube TODOS los archivos extraídos a EasyPanel"
echo "3. Configura index.html como página principal"
echo "4. Lee README_INSTRUCCIONES.txt dentro del ZIP"
echo ""
echo "💡 MEJOR OPCIÓN: Usa GitHub + EasyPanel (lee LEEME_EASYPANEL.md)"
echo ""
