# Control

Aplicación mobile-first (Expo + React Native) para inventario y contabilidad de productos con backend en Supabase.

## Funcionalidades MVP
- Autenticación con Supabase Auth.
- Roles y perfiles: `ADMIN`, `OPERADOR`, `LECTURA`.
- Administración de usuarios (crear, activar/desactivar, cambiar rol) para `ADMIN`.
- Productos con QR único.
- Escaneo QR por cámara para entradas/salidas/ajustes.
- Kardex de movimientos.
- Cálculo de stock y valorización por costo promedio ponderado.
- Reporte de stock bajo.
- Generación de PDF A4 de etiquetas QR.

## Stack
- Expo + React Native + TypeScript
- Supabase (Postgres, Auth, Storage, Edge Functions)

## Configuración local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Completar en `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Aplicar esquema SQL en Supabase (`SQL Editor`) usando `supabase/schema.sql`.
5. Desplegar función edge:
   ```bash
   supabase functions deploy create-user
   ```
6. Ejecutar app:
   ```bash
   npm run start
   ```

## Despliegue
- **Mobile:** usar EAS Build (`eas build -p android|ios`).
- **Backend:** proyecto Supabase con RLS habilitado y función `create-user` desplegada.
- **Storage:** crear bucket opcional para imágenes de productos.

## Reglas críticas implementadas
- No edición directa de stock: se deriva de `inventory_movements`.
- Restricción por defecto de stock negativo; editable por `ADMIN` vía `app_settings`.
- Auditoría de `created_by` y `created_at`.
- RLS por rol e `is_active`.
