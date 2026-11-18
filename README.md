# Gerencia Industrial – Tablero de indicadores · v2

Tablero de KPI de la gerencia y la dirección de Cerámica Marcos Paz – Planta Cevil. Las bases de datos, las columnas, las variables, las constantes y las fórmulas de cada KPI se configuran desde la app.

- **Frontend (GitHub Pages):** `index.html`, `styles.css`, `app.js`, `config.js`, `logo-cmp.png` (en la raíz del repo).
- **Backend (Apps Script):** `apps-script/Code.gs`, `apps-script/Calculo.gs`, `apps-script/appsscript.json`.
- **Base:** «Gerencia Industrial · Base» (`110dmHkzGxyMiPzE-iH5fe2utvftsPSCr9CdObVbU0Qo`).

## Actualizar de v1 a v2

1. **Apps Script:** reemplazar el contenido de `Code.gs` y `Calculo.gs`. Configuración del proyecto → mostrar `appsscript.json` → reemplazarlo; agrega el permiso de envío de correo para la recuperación de clave.
2. Ejecutar **`setup`** y aceptar los permisos nuevos. La migración es automática:
   - crea las hojas `Fuentes`, `Variables`, `Constantes`, `Kpis` y `Secciones`;
   - pasa las metas que ya estaban cargadas;
   - renombra `Objetivos` a `Objetivos_v1`;
   - conserva usuarios, cargas e historial.
3. Implementar → Administrar implementaciones → ✏️ → Versión: **Nueva versión** → Implementar. La URL `/exec` no cambia.
4. **GitHub:** reemplazar `index.html`, `styles.css`, `app.js` y `config.js` (ya tiene la URL del script). `logo-cmp.png` queda en la raíz.
5. Si quedó un `Calculo.gs` viejo con otro nombre, borrarlo para que no haya funciones duplicadas.

## Modelo de cálculo

```
Bases de datos ─▶ Variables (hoja + columnas + filtros + resumen mensual) ─┐
Constantes ───────────────────────────────────────────────────────────────┼─▶ Indicadores (fórmula) ─▶ Tablero
Cargas manuales ─▶ Variables manuales ─────────────────────────────────────┘
```

| Elemento | Qué se configura | Quién |
|---|---|---|
| Base de datos | Link de la planilla (o URL de una API) | Admin |
| Variable | Base, hoja, fila de encabezados, modo, columna de fecha (o año + mes), cálculo, columna de valor o categoría, filtros, transformación, unidad | Admin |
| Constante | Valor fijo usado en fórmulas | Admin |
| Indicador | Fórmula, sección, unidad, tipo de tarjeta, decimales, par | Admin |
| Objetivo | Meta, sentido, tolerancia, visible, orden, nombre | Gerente o Admin |
| Sección | Nombre, subtítulo, ícono, orden, link «Abrir app» | Admin |

**Modos de variable:** `fecha` (agrupa por mes según una columna de fecha) · `aniomes` (columnas año y mes) · `foto` (estado actual, se guarda cada mes en `HistSnapshot`) · `api` (clave de un JSON) · `manual` (se carga en la app).

**Cálculo de la variable:** suma · conteo · promedio · máximo · mínimo · último · distintos (día + columna clave, ej. turnos) · categorías (conteo por valor, alimenta las barras de distribución).

**Filtros:** separados por `;`. Operadores `=`, `!=`, `~` (contiene), `!~`, `^` (empieza con), `>`, `<`, `>=`, `<=`. Si el valor queda vacío después de `=` o `!=`, significa celda vacía o no vacía. Ejemplo: `H~TIERRA; G~CEVIL; F>0`. Las columnas se indican por letra (`F`) o por título (`Estado`).

**Fórmulas:** `+ - * / ( )`, ids de variables, constantes u otros indicadores, y estas funciones:
- `cat(var, "Texto|Otro")`: suma las categorías indicadas.
- `total(var)`: total de categorías.
- `n(x)`: devuelve 0 si no hay dato.
- `min`, `max`, `abs`.

Si falta un dato o hay división por cero, el resultado queda sin valor. El editor tiene **Probar fórmula** y **Probar lectura** para ver los últimos 6 meses antes de guardar.

## Indicadores precargados

| Sección | Indicador | Fórmula |
|---|---|---|
| Producción | Producción promedio (tn/turno) | `prod_tn / prod_turnos` |
| | Gas (m³/tn) | `gas_m3 / prod_tn` |
| | Eléctrico (kWh/tn, mes cerrado) | `elec_kwh / prod_tn` |
| | HH/tn (vacante, carga manual) | `hh_mes / prod_tn` |
| Matricería | Moldes operativos | `cat(moldes_estado, "Operativo") / total(moldes_estado) * 100` |
| | Moldes en peso óptimo | `cat(moldes_peso, "Óptimo") / total(moldes_peso) * 100` |
| | OT del taller entregadas | `cat(taller_estados, "Entregado") / total(taller_estados) * 100` |
| Mantenimiento | Plan preventivo (vacante, carga manual) | `preventivo_pct` |
| | Disponibilidad de extrusora | `(bal_horas - bal_par_h - bal_par_min / 60) / bal_horas * 100` |
| | Pérdida por paradas | `(bal_par_h + bal_par_min / 60) / bal_horas * 100` |
| | OT resueltas / OT urgentes | `cat(mant_estados, "Resuelta")…` / `cat(mant_tipos, "OTU")…` |
| Abastecimiento | Viajes de arcilla + m³ | `viajes_tierra` · `viajes_tierra * M3_POR_VIAJE` |
| | Stock en planta + cantera (manual) | `(stock_playa + n(stock_silo)) / DENSIDAD_TIERRA` |
| Insumos críticos | Tarimas por tn palletizada | `(tarimas_cons + n(tarimas_desc)) / tn_pal` |
| | Stretch kg/tn · Cal bolsas/tn · Gasoil L/tn | `stretch_kg / tn_pal` · `cal_bolsas / tn_pal` · `gasoil_l / tn_pal` |

`tn_pal` = Toneladas palletizadas de `KpiSupervisores` (Informe de Producción). El consumo de insumos sale de `StockDiarioTarimas`, `StockDiarioStretch` y `StockDiarioCAL` (Stock Insumos Críticos) y de `Control_Diaro` (Combustible CMP). Los indicadores de insumos vienen **sin meta**: hay que cargarla en Ajustes → Indicadores.

## Tarjetas

- **Barra vertical derecha:** % de cumplimiento de la meta. La escala va de 0 a 150 % y la línea marca el 100 %. Para «menor es mejor» se calcula como meta ÷ valor. Color: verde (en objetivo), ámbar (dentro de la tolerancia), coral (fuera).
- **Variación ▲▼** contra el mes anterior, en verde si mejora y en coral si empeora. En el mes en curso no se muestra para acumulados (viajes), porque compararía un mes parcial contra uno completo.
- **Distribución:** barra segmentada más una fila por categoría. En el detalle se ve la evolución mensual apilada.
- **Detalle (click):** cumplimiento, comparaciones, gráfico de 13 meses, día por día (cuando todas las variables son diarias), variables usadas e historial.

## Roles y acceso

| Rol | Puede |
|---|---|
| Lector | Ver el tablero, cambiar su clave y su correo |
| Editor | Además cargas manuales y recálculo |
| Gerente de producción | Además metas, sentido, tolerancia, visibilidad y orden de los indicadores |
| Administrador | Todo: bases, variables, constantes, fórmulas, secciones, usuarios, parámetros, registro |

**Recuperación de clave:** en el login, «¿Olvidaste tu clave?» envía un código de 6 dígitos válido 15 minutos. Llega al correo del usuario; si el usuario no tiene correo cargado, llega a `CORREO_RECUPERACION` (eacevedo@ceramicamarcospaz.com.ar). Límites: 3 códigos por hora y 5 intentos por código.

## Rendimiento

| Qué | Cómo |
|---|---|
| Lectura | Una sola lectura por hoja, solo el bloque de columnas que usan las variables |
| Caché | Las variables mensuales se guardan comprimidas (caché del script + hoja `Snapshot`). Los indicadores se recalculan de ahí en milisegundos |
| Activador | `precalentar` cada 10 min (parámetro `REFRESCO_MIN`) |
| Cambios | Metas, fórmulas, constantes y cargas no vuelven a leer las planillas. Bases y variables sí |
| Navegador | Muestra al instante lo último guardado y actualiza en segundo plano. Chart.js se descarga solo al abrir un detalle |
