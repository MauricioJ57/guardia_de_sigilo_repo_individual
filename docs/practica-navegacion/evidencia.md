# Evidencia — práctica de navegación
Repositorio: https://github.com/MauricioJ57/guardia_de_sigilo_repo_individual.git
Commit inicial: ebe08ce7731eee63ccfb727d4a00ddba015125b0
Commit de implementación: 1864b63ea7c56ad35bcafa5aae1e2d164ecf3f4d
Versión de entrega: "se uso "git rev-parse HEAD" para conseguir el commit final"
Variante: B (única variante desarrollada).
Herramienta/modelo o trabajo manual: OpenCode (agente; modelo opencode/big-pickle); revisión y decisiones humanas del estudiante.
Entorno: Windows; Node con vitest 4.1.10; vite 6.4.3; verificación de tipos con tsc --noEmit.
Cambios previos: Ninguno (HEAD = ebe08ce7731eee63ccfb727d4a00ddba015125b0; sólo documentos de esta práctica sin commit).
Línea base: HEAD = ebe08ce7731eee63ccfb727d4a00ddba015125b0; `git status --short` = `?? docs/practica-navegacion/` (sin cambios de código previos). Prueba enfocada inicial `npm run test:run -- tests/navigation` = 2 archivos, 15 pruebas aprobadas; sin fallos previos observados.

## Exploración mínima
| Capa | Ruta/símbolo | Capacidad comprobada |
|---|---|---|
| Búsqueda | src/domain/navigation/search.ts — findPathBfs, findPathAStar | BFS y A* devuelven status, path, totalCost, expandedNodes, maximumFrontier, explored; distinguen invalid-start, invalid-goal, unreachable; A* admite EntryCostProfile con default unitario |
| Seguimiento | src/domain/navigation/pathFollower.ts — advanceAlongPath | Consume varios puntos por actualización (position, nextWaypoint, completed, direction) sin depender de Phaser ni del delta |
| Consumidor | src/application/simulation/navigationDemo.ts — calculateRoute; src/game/scenes/GameScene.ts | La aplicación selecciona BFS/A* y propaga el perfil de costos; Phaser pinta ruta/explorados y mueve al guardia por centros de celda |
| Pruebas | tests/navigation/search.test.ts; tests/navigation/pathFollower.test.ts; tests/navigation/commonFixture.test.ts; tests/navigation/exposure.test.ts; tests/application/navigationDemo.test.ts | Cubren optimalidad, casos límite, extremos inválidos, seguimiento, fixture común 5x3, máscara expuesta y conexión del consumidor |

Contraste y decisión humana: Decisión humana confirmada: C1 (BFS ignora perfil), D2 (consumidor calculateRoute), A1 (perfil en search.ts), T1 (pruebas en tests/navigation y tests/application).
Spec/plan aprobados: Spec aprobada tras confirmar C1/D2/A1/T1; plan.md aprobado y completado con los tres incrementos.

## Comparación común — fixture libre 5x3
Vecinos y desempate reales: vecinos cardinales en orden arriba, derecha, abajo, izquierda (gridGraph.ts); A* desempata por menor heurística y luego por orden de inserción (search.ts, lowestPriorityNode).
| Algoritmo | Estado | Ruta | Pasos | Costo | Expandidos | Frontera máxima |
|---|---|---|---:|---:|---|---|
| BFS | success | (0,1)->(1,1)->(2,1)->(3,1)->(4,1) | 4 | 4 | 12 | 4 |
| A* | success | (0,1)->(1,1)->(2,1)->(3,1)->(4,1) | 4 | 4 | 5 | 9 |
DFS: traza sobre el fixture común con orden de vecinos arriba, derecha, abajo, izquierda: la pila recorre (0,1)->(0,0)->(1,0)->(2,0)->(3,0)->(4,0)->(4,1) y alcanza la meta en 6 pasos. Límite: devuelve un camino válido sin evaluar costo ni garantizar optimalidad frente a los 4 pasos de BFS/A*/Dijkstra.
Dijkstra: costos unitarios de la traza (0,0):1, (1,1):1, (0,2):1, (1,0):2, (2,1):2, (1,2):2, (2,0):3, (3,1):3, (2,2):3, (3,0):4, (4,1):4; ruta (0,1)->(1,1)->(2,1)->(3,1)->(4,1), 4 pasos, costo 4. Conclusión: con costos unitarios el costo mínimo coincide con los pasos; en el anexo B costo y pasos se separan.

## Criterio → evidencia
| Criterio | Prueba/archivo y comando o reproducción | Observado | Cumple/pendiente |
|---|---|---|---|
| BASE-AC1 | `git rev-parse HEAD`, `git status --short`; rutas de capas en "Exploración mínima" | HEAD = ebe08ce7731eee63ccfb727d4a00ddba015125b0; único cambio previo = `?? docs/practica-navegacion/`; línea base sin fallos | Cumple |
| BASE-AC2 | `tests/navigation/commonFixture.test.ts`; `npm run test:run -- tests/navigation/commonFixture.test.ts --reporter=verbose` | BFS y A*: success, 4 pasos, costo 4; expandidos 12 (BFS) / 5 (A*); frontera máxima 4 (BFS) / 9 (A*); todos los campos de métricas existen, ninguno inventado | Cumple |
| BASE-AC3 | `tests/navigation/commonFixture.test.ts` (inicio=meta, barrera y extremos) | inicio=meta: success, costo 0; barrera (2,0)(2,1)(2,2) con meta libre: unreachable, path [], costo null; (-1,1): invalid-start; (5,1): invalid-goal; expandidos 0 | Cumple |
| BASE-AC4 | `spec.md` (Estado: Aprobado) y `plan.md`; decisión C1/D2/A1/T1 | Spec y plan aprobados por decisión humana; contraste y decisión registrados; sólo se desarrolló el anexo B | Cumple |
| B-AC1 | `tests/navigation/exposure.test.ts` > "charges 16 to the direct route and prefers a 6-step detour with cost 6" | Ruta directa (0,1)->(1,1)->(2,1)->(3,1)->(4,1) cuesta 16 (5+5+5+1); A* con perfil expuesto devuelve 6 pasos, costo 6 y no entra en {1,1},{2,1},{3,1} | Cumple |
| B-AC2 | `tests/navigation/exposure.test.ts` > "stops avoiding the strip when the penalty is zero" | Penalización 0: ruta directa cuesta 4 y A* devuelve 4 pasos, costo 4; la máscara no bloquea | Cumple |
| B-AC3 | `tests/application/navigationDemo.test.ts` > detour / unit / BFS | `calculateRoute(..., "astar", perfil expuesto)` = 6 pasos, costo 6, sin celdas expuestas; sin perfil = 4 pasos, costo 4; BFS ignora el perfil; percepción y memoria sin modificar | Cumple |
| BASE-AC5 | `npm run validate`; `git status --short` y `git diff` | typecheck OK; 53 pruebas en 9 archivos; build OK; criterios del anexo con pruebas reproducibles y conexión con el consumidor; sin regresiones ni ampliaciones ocultas | Cumple |
| BASE-AC6 | `evidencia.md`, `spec.md`, `plan.md`, URL y commit final | Los tres documentos y la URL existen y coinciden; el commit final queda PENDIENTE porque no se autorizaron commits | Pendiente |

## Registro mínimo de intervención
Prompts (por paso de la guía): Paso 1 (BASE-01) explorar en lectura búsqueda, seguimiento, consumidor y pruebas. Paso 2 (BASE-01) línea base con commit, cambios previos y comando de referencia. Paso 3 (BASE-02) comparar BFS/A* en el fixture 5x3. Paso 4 (BASE-03) trazas DFS/Dijkstra. Paso 5 (BASE-05) redactar la spec con un único anexo B y confirmar C1/D2/A1/T1. Paso 6 (BASE-05) plan de tres incrementos. Paso 7 (BASE-06) implementar por incremento. Paso 8 (BASE-07) validar y cerrar evidencia. Modificaciones importantes (no el chat completo): en `search.ts`, `EntryCostProfile`, `UNIT_ENTRY_COST`, `entryCost` y parámetro `profile` en `findPathAStar`; en `navigationDemo.ts`, parámetro `profile` opcional propagado por `calculateRoute`; pruebas nuevas `exposure.test.ts` y `navigationDemo.test.ts`.
Decisión tras incremento 1: ACEPTAR — prueba enfocada `npm run test:run -- tests/navigation` = 4 archivos, 26 pruebas; modo unitario sin regresión.
Decisión tras incremento 2: ACEPTAR — `npm run test:run` = 9 archivos, 53 pruebas; BFS unitario y contrato de `calculateRoute` preservados; percepción y memoria intactas.
Validación final: `npm run validate` = typecheck OK, 53 pruebas en 9 archivos, build OK (sólo advertencia de tamaño de chunk de Phaser). Sin fallos.
Diff revisado: M src/domain/navigation/search.ts; M src/application/simulation/navigationDemo.ts; nuevos tests/navigation/commonFixture.test.ts, tests/navigation/exposure.test.ts, tests/application/navigationDemo.test.ts; docs/ sin commit. Sin cambios en GameScene.ts, labLevel.ts, percepción ni memoria.
Conclusión: con costos unitarios conviene BFS/A* (óptimos de 4 pasos) y DFS no garantiza optimalidad al devolver 6 pasos. Para el anexo B conviene A* ponderado por costo de entrada: prefiere el rodeo de 6 pasos/costo 6 frente a la directa de costo 16, y con penalización 0 vuelve a la directa de costo 4. El perfil se aísla como configuración en el dominio y se conecta por `calculateRoute`, conservando el dominio puro y la conducta previa. Pasos y costo se reportan separados y sólo coinciden en modo unitario.
Limitaciones: sin prueba end-to-end de navegador; la conexión del consumidor se verifica con `calculateRoute` (aplicación), no con `GameScene`; la prueba enfocada `tests/navigation` no incluye `tests/application`; el commit de implementación y el final quedan pendientes de autorización. Fallos abiertos: ninguno observado en las ejecuciones registradas.
