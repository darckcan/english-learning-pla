# Nexus Fluent - Guía Rápida de Despliegue

## 🎯 Solución al Error EISDIR

El error que experimentaste:
```
EISDIR: illegal operation on a directory, open '/etc/easypanel/projects/nexus_fluent/nexusfluente/code/src/components/'
```

**Causa:** EasyPanel intentaba servir directorios de código fuente como archivos.

**Solución:** Usar la aplicación compilada (carpeta `dist/`) en lugar del código fuente.

## ⚡ Despliegue Rápido (Recomendado)

### Método 1: Docker con Nginx (MÁS RÁPIDO)

```bash
# En EasyPanel:
1. Crear nuevo servicio → Docker
2. Repository: [tu-repo]
3. Dockerfile: Dockerfile.nginx
4. Port: 80
5. Deploy!
```

**Ventajas:**
- ✅ Más rápido (Nginx)
- ✅ Menor uso de memoria
- ✅ Mejor para producción

### Método 2: Docker con Node.js (MÁS SIMPLE)

```bash
# En EasyPanel:
1. Crear nuevo servicio → Docker
2. Repository: [tu-repo]
3. Dockerfile: Dockerfile
4. Port: 3000
5. Deploy!
```

**Ventajas:**
- ✅ Más fácil de debuggear
- ✅ Configuración simple

## 🔧 Método 3: Sin Docker

Si EasyPanel no soporta Docker:

```bash
# Build Command:
npm install && npm run build

# Start Command:
npm run serve

# Port: 3000
```

## ✅ Verificación Post-Despliegue

Después del despliegue, verifica:

1. **URL funciona:** Abre tu dominio de EasyPanel
2. **Login funciona:** Prueba con `darckcan` / `M.ario123`
3. **Registro funciona:** Crea un usuario nuevo
4. **Stripe funciona:** Intenta comprar una membresía (modo test)
5. **Datos persisten:** Cierra sesión y vuelve a iniciar

## 🐛 Troubleshooting

### Si ves pantalla blanca:
```bash
# Verifica en los logs de EasyPanel:
# - "build completed successfully"
# - "Server running on port XXXX"
```

### Si dice "Cannot GET /":
- Verifica que el comando start use `serve -s dist`
- Confirma que existe la carpeta `dist/`

### Si los archivos no cargan (404):
- Verifica la configuración de nginx.conf
- Confirma que los assets estén en dist/assets/

## 📞 Soporte Adicional

Ver documentación completa: `EASYPANEL_DEPLOYMENT.md`

---

**¿Todo listo? ¡Deploy y a enseñar inglés! 🚀**
