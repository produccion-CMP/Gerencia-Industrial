# Gerencia Industrial – Tablero de indicadores

Tablero de KPI para la gerencia y la dirección de Cerámica Marcos Paz – Planta Cevil. Lee las bases existentes (sin migrar datos), calcula los indicadores por mes y los compara contra objetivos configurables desde la app.

- **Frontend:** `index.html`, `styles.css`, `app.js`, `config.js`, `img/logo-cmp.png`. GitHub Pages. Mismo sistema visual que Control de Tierra e Insumos Críticos (Plus Jakarta Sans, acento terracota, tema claro/oscuro, navegación inferior en el celular).
- **Backend:** `apps-script/Code.gs`, `apps-script/Calculo.gs`, `apps-script/appsscript.json`. Aplicación web de Apps Script.
- **Base nueva:** «Gerencia Industrial · Base» (la crea `setup()`): usuarios, objetivos, parámetros, cargas manuales, historial de estados y registro.

## Indicadores

| Sección | Indicador | Fuente | Cálculo |
|---|---|---|---|
| Producción | Producción promedio (tn/turno) | Informe de Producción · `Producción` | Σ tn del mes ÷ turnos con producción (fecha + turno) |
| | Consumo específico de gas (m³/tn) | Informe de Producción · `Lectura de Gas` | Σ m³ del mes ÷ Σ tn |
| | Consumo específico eléctrico (kWh/tn) | Ingeniería GMP · `Gestión Energética` (servicio 699549) | kWh facturados ÷ Σ tn. Usa el último mes cerrado y lo indica |
| | Uso del recurso humano (HH/tn) | **Vacante** · carga manual | HH cargadas ÷ Σ tn |
| Matricería y taller | Moldes operativos (%) + inventario por estado | Seguimiento de moldes · `Seguimiento` | Operativos ÷ total |
| | Moldes en peso óptimo (%) | Seguimiento de moldes · `Seguimiento` | Óptimo ÷ evaluados (sin irrecuperables) |
| | Órdenes del taller entregadas (%) | Taller CMP · `O.T. Taller de YB` | Entregadas ÷ programadas en el mes. El detalle lista las OT sin entregar |
| Mantenimiento | Cumplimiento del plan preventivo (%) | **Vacante** (`Parametros_Preventivo` sin plan) · carga manual | — |
| | Disponibilidad de extrusora (%) | Informe de Producción · `Bal-Paradas` | (Horas de turno − paradas) ÷ horas de turno |
| | Pérdida por paradas (%) | Informe de Producción · `Bal-Paradas` (+ `Paradas` por motivo cuando tenga datos) | Paradas ÷ horas de turno |
| | OT de mantenimiento resueltas (%) | DB_Mantenimiento_CEVIL · `OTs` | Resueltas ÷ OT programadas en el mes |
| | OT urgentes (%) | DB_Mantenimiento_CEVIL · `OTs` | OTU ÷ total (OTI < 15 días, OTA > 15 días) |
| Abastecimiento | Viajes de arcilla / m³ transportados | Carga de viajes de tierra · `ViajesUnificados` | Tipo TIERRA con destino CEVIL; m³ = viajes × `M3_POR_VIAJE` |
| | Stock en planta (m³) | API de Control de Tierra (playa + silo) | t ÷ densidad |
| | Stock en cantera (m³) | **Vacante** · carga manual | — |
| Insumos críticos | Cobertura de tarimas, stretch y cal (días) | Stock Insumos Críticos · `StockEstadoActual` | Días de stock disponible |

**Estado de cada indicador:** dentro de objetivo si cumple la meta; «atención» si está peor que la meta pero dentro de la tolerancia (% de la meta); fuera de objetivo si la supera. Sin meta = informativo.

Los indicadores «de foto» (moldes, stock, coberturas) se guardan cada mes en `HistSnapshot`, así que el historial se arma desde que la app empieza a calcularlos.

## Roles

| Rol | Puede |
|---|---|
| Lector | Ver el tablero, el detalle y cambiar su clave |
| Editor | Además cargas manuales (HH, preventivo, stock cantera) y recalcular |
| Gerente de producción | Además objetivos: meta, sentido, tolerancia, nombre, orden y **qué indicadores se muestran** |
| Administrador | Todo: usuarios, parámetros, IDs de fuentes y registro de cambios |

El parámetro `ACCESO_PUBLICO = SI` permite ver el tablero sin iniciar sesión (por defecto `NO`). Claves con SHA-256 + sal; sesión de 8 h; bloqueo de 10 min tras 6 intentos fallidos.

## Puesta en marcha

### 1. Backend

1. Con una cuenta con **acceso de lectura a las 7 planillas de origen**, crear un proyecto en <https://script.google.com>: «Gerencia Industrial – API».
2. Crear los archivos `Code.gs` y `Calculo.gs` con el contenido de `apps-script/`.
3. Configuración del proyecto → «Mostrar el archivo de manifiesto» → reemplazar `appsscript.json`.
4. Elegir la función `setup` → **Ejecutar** y autorizar. Crea la base nueva, las hojas, los objetivos por defecto, la propiedad `ADMIN_KEY` y el activador que recalcula cada 10 minutos. El registro de ejecución muestra la URL de la base y la `ADMIN_KEY`.
5. Implementar → Nueva implementación → Aplicación web · Ejecutar como **Yo** · Acceso **Cualquier usuario**. Copiar la URL `/exec`.

Cada cambio de código: Implementar → Administrar implementaciones → Editar → **Nueva versión** (mantiene la URL).

### 2. Frontend

1. Crear el repositorio `produccion-CMP/Gerencia-Industrial` y subir `index.html`, `styles.css`, `app.js`, `config.js`, `README.md` e `img/`.
2. En `config.js` completar `SCRIPT_URL` con la URL `/exec`.
3. Settings → Pages → Deploy from a branch → `main` / `(root)`.
4. Primer ingreso: cualquier usuario (ej. `ezequiel`) + `ADMIN_KEY` → queda creado como administrador. Después crear los usuarios en Ajustes → Usuarios.

### 3. Primeros ajustes recomendados

- Ajustes → Objetivos: cargar las metas reales (las de la maqueta vienen por defecto) y ocultar lo que no se use.
- Ajustes → Parámetros: `M3_POR_VIAJE` (sin valor no se calcula «Arcilla transportada»), `UNIDAD_STOCK_TIERRA` y `DENSIDAD_TIERRA`, `LUGAR_TALLER` si se quiere filtrar el taller de Cevil.

## Rendimiento

| Qué | Cómo |
|---|---|
| Cálculo | Un activador lee todas las fuentes (solo las columnas necesarias) y arma un paquete de ~30 KB con 24 meses |
| Servido | El paquete se guarda comprimido (gzip) en la caché del script y en la hoja `Snapshot`; cada consulta responde sin abrir planillas |
| Navegador | Guarda el último paquete: el tablero aparece al instante y se actualiza en segundo plano. Cambiar de mes no consulta al servidor |
| Gráficos | Chart.js se descarga solo al abrir el detalle de un indicador |
| Recalcular | Botón ⟳ (editor o superior) o al guardar parámetros y cargas |

## Uso

- Selector de mes arriba a la derecha (también con ← →). Los chips de resumen filtran por estado.
- Click en un indicador: valor, meta, mes anterior, mismo mes del año anterior, promedio y mejor de 12 meses, gráfico de 13 meses con la meta, día por día (producción y gas), detalle y historial.
- Botón 🖨️: impresión o PDF del tablero del mes seleccionado.
