@echo off
echo 📦 Creando paquete para EasyPanel...
echo.

REM Compilar la aplicación
echo 🔨 Compilando aplicación...
call npm install
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en la compilación
    pause
    exit /b 1
)

REM Verificar que dist existe
if not exist "dist\" (
    echo ❌ La carpeta dist\ no existe
    pause
    exit /b 1
)

REM Crear carpeta de empaquetado
if exist "easypanel-package" rmdir /s /q easypanel-package
mkdir easypanel-package

REM Copiar archivos compilados
echo 📂 Copiando archivos...
xcopy /E /I /Y dist\* easypanel-package\

REM Crear archivo .htaccess para Apache
echo ^<IfModule mod_rewrite.c^> > easypanel-package\.htaccess
echo   RewriteEngine On >> easypanel-package\.htaccess
echo   RewriteBase / >> easypanel-package\.htaccess
echo   RewriteRule ^^index\.html$ - [L] >> easypanel-package\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-f >> easypanel-package\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-d >> easypanel-package\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-l >> easypanel-package\.htaccess
echo   RewriteRule . /index.html [L] >> easypanel-package\.htaccess
echo ^</IfModule^> >> easypanel-package\.htaccess

REM Crear README con instrucciones
(
echo 📦 PAQUETE NEXUS FLUENT PARA EASYPANEL
echo.
echo Este paquete contiene los archivos compilados de Nexus Fluent.
echo.
echo 🚀 CÓMO SUBIR A EASYPANEL:
echo.
echo Opción 1: Si EasyPanel soporta archivos estáticos
echo 1. Sube TODOS los archivos de esta carpeta a EasyPanel
echo 2. Configura index.html como archivo principal
echo 3. Si usa Apache: el archivo .htaccess ya está incluido
echo.
echo Opción 2: Si EasyPanel soporta GitHub
echo NO uses este paquete. En su lugar:
echo 1. Sube el proyecto completo a GitHub
echo 2. Conecta EasyPanel con GitHub
echo 3. Build: npm install ^&^& npm run build
echo 4. Start: npx serve -s dist -l 3000
echo.
echo ⚠️ IMPORTANTE:
echo - Sube TODOS los archivos, no solo index.html
echo - La carpeta assets\ es necesaria
echo - Configura SPA routing ^(ver .htaccess^)
echo.
echo 📞 Si tienes problemas, lee: LEEME_EASYPANEL.md
) > easypanel-package\README_INSTRUCCIONES.txt

echo.
echo ✅ ¡Paquete creado exitosamente!
echo.
echo 📦 Carpeta: easypanel-package\
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Ve a la carpeta easypanel-package\
echo 2. Sube TODOS los archivos a EasyPanel
echo 3. Configura index.html como página principal
echo 4. Lee README_INSTRUCCIONES.txt
echo.
echo 💡 MEJOR OPCIÓN: Usa GitHub + EasyPanel ^(lee LEEME_EASYPANEL.md^)
echo.
pause
