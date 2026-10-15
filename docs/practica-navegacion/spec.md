# Spec: práctica de navegación — 7 al 14/10/2026

Estado: Aprobado
Repositorio: https://github.com/MauricioJ57/guardia_de_sigilo_repo_individual.git
Commit inicial: ebe08ce7731eee63ccfb727d4a00ddba015125b0
Variante elegida: B
Rutas relevantes: src/domain/navigation/search.ts (findPathAStar adaptado con EntryCostProfile; findPathBfs unitario; cellKey); src/domain/navigation/gridGraph.ts (walkableNeighbors, manhattanDistance); src/application/simulation/navigationDemo.ts (calculateRoute — consumidor; propaga el perfil); src/domain/model/grid.ts; src/domain/model/vector.ts; tests/navigation/search.test.ts; tests/navigation/pathFollower.test.ts; tests/navigation/exposure.test.ts (nuevo); tests/application/navigationDemo.test.ts (nuevo, consumidor). Contexto sin modificar: src/application/simulation/labLevel.ts; src/game/scenes/GameScene.ts.
Comandos confirmados: prueba enfocada `npm run test:run -- tests/navigation`; validación completa `npm run validate`

## Objetivo
Comparar navegación y verificar una única mejora con un caso normal y uno
límite, manteniendo separadas búsqueda, seguimiento y decisión.

## Alcance
Exploración, línea base, comparación BFS/A*, trazas guiadas DFS/Dijkstra,
adaptación de esta spec, un plan de tres incrementos, la variante seleccionada,
validación y entrega. La variante se conecta con una entrada de navegación o
simulación existente; no queda como un algoritmo aislado sin consumidor.

## Fuera de alcance
Implementar DFS o Dijkstra; cambiar FSM, percepción o controles; agregar
dependencias, editor de mapas, motor nuevo o despliegue; hacer varias variantes.

## Requisitos comunes
BASE-01: identificar búsqueda, seguimiento, consumidor y pruebas con rutas;
registrar commit inicial, cambios previos y validación de referencia.
BASE-02: usar el fixture de 5x3 definido debajo y registrar vecinos/desempate.
Comparar BFS y A* unitarios con igual mapa, inicio y meta: estado, ruta, pasos,
costo, nodos expandidos y frontera máxima. No inventar métricas ausentes.
Si una métrica no existe, registrar la limitación sin agregar instrumentación
obligatoria; conservar al menos estado, ruta, pasos y costo comprobable.
BASE-03: explicar la traza DFS y completar los costos de la traza Dijkstra
provistas en la guía. No implementar nuevos algoritmos para este requisito.
BASE-04: verificar éxito con ruta válida, inicio igual a meta con costo 0,
destino libre pero inaccesible y extremos inválidos, usando el contrato real
del proyecto. No representar éxito inmóvil y fracaso de forma indistinguible.
BASE-05: copiar un solo anexo, contrastar sus supuestos con el código, completar
rutas/comandos y señalar incompatibilidades. Aprobar spec y plan antes de editar
código. Registrar un contraste y una decisión humana, sin transcribir el chat.
BASE-06: implementar sólo la variante aprobada, reutilizar capacidades ya
existentes y revisar cada incremento. Conservar dominio puro y conducta previa.
BASE-07: producir evidencia del camino normal, el caso límite y una llamada
desde el consumidor real o su prueba de integración. Ejecutar prueba enfocada
y validación del repositorio; revisar diff y regresiones.
BASE-08: entregar el 14/10/2026, en un único paquete, spec.md, plan.md y
evidencia.md bajo docs/practica-navegacion/, más URL y commit final.

## Fixture común
Cuadrícula: x=0..4, y=0..2; origen arriba a la izquierda; cuatro vecinos,
sin diagonales; inicio S=(0,1), meta G=(4,1); todas las celdas libres y costo 1.
La ruta incluye inicio y meta. Pasos = cantidad de aristas, no de puntos.
Para el caso inaccesible, bloquear (2,0), (2,1) y (2,2); la meta sigue libre.
Para extremos inválidos: inicio (-1,1) o meta (5,1), en casos separados.
Traducir el fixture al formato actual sin cambiar su semántica.

## Restricciones
No sobreescribir cambios anteriores ni modificar pruebas para ocultar fallos.
No instalar dependencias, acceder a secretos o publicar. No cambiar el motor
ni la FSM. Escritura acotada a documentos, navegación, su consumidor mínimo y
pruebas previstas en el plan. No autorizar commits automáticos.
Todos los comandos deben existir o estar justificados y autorizados.

## Criterios comunes
BASE-AC1: evidencia identifica repositorio/commit, capas, cambios previos,
comando y resultado inicial; lo observado se distingue de lo supuesto.
BASE-AC2: en el fixture libre, BFS y A* devuelven ruta cardinal válida de
4 pasos y costo 4. Registrar resultados reales y explicar métricas disponibles.
Las trazas DFS/Dijkstra incluyen conclusión sobre pasos frente a costos.
BASE-AC3: inicio=meta es éxito de costo 0; barrera completa es inaccesible;
extremos fuera de mapa producen resultados inválidos según contrato documentado.
BASE-AC4: spec y plan aprobados antes de implementación; una decisión humana
y su contraste quedan registrados, y sólo se desarrolla el anexo elegido.
BASE-AC5: criterios del anexo tienen pruebas reproducibles; existe evidencia
de su conexión con el consumidor; validación final y diff revisados, sin
regresiones nuevas ni ampliaciones ocultas del alcance.
BASE-AC6: los tres documentos, la URL y el commit final identifican la misma
versión entregada el 14/10; los cambios de código y pruebas están en ese commit.

## Evidencia y decisiones
Usar la plantilla evidencia.md de esta guía. Si un supuesto no se cumple,
marcarlo como pendiente y consultar; no aprobar una spec con dudas que afecten
el comportamiento. La hora/canal de entrega será la indicada por la cátedra.

Decisión humana registrada: se confirman C1, D2, A1 y T1. C1: BFS sigue
unitario e ignora el perfil. D2: el consumidor es `calculateRoute` en
`src/application/simulation/navigationDemo.ts`; la conexión se prueba con un
test nuevo, sin modificar `GameScene.ts` ni `labLevel.ts`. A1: el perfil de
costos vive en `src/domain/navigation/search.ts`. T1: pruebas en
`tests/navigation/exposure.test.ts` y `tests/application/navigationDemo.test.ts`.

## Anexo B: zonas expuestas
Intención: preferir menos exposición cuando existe una alternativa razonable.
Escenario: fixture BASE, con máscara expuesta en (1,1), (2,1), (3,1).
Costo de entrar = 1 + penalización; penalización 4 si expuesta, 0 si no.
El inicio no suma costo. Exposición es preferencia, no obstáculo ni probabilidad.

Requisitos:
B-01: usar la máscara fija explícita para calcular costos positivos de entrada.
No leer jugador oculto ni cambiar sensores o memoria; todas las celdas son libres.
B-02: la búsqueda ponderada usa A* existente adaptado o capacidad equivalente,
con Manhattan y costo mínimo 1; mantiene el caso unitario y BFS existentes.
B-03: conectar perfil de penalización con el consumidor de navegación/simulación
existente mediante configuración, sin interfaz nueva ni adaptación de la FSM.
B-04: con penalización 0, dejar de evitar la máscara por costos anteriores.

Criterios:
B-AC1: directa de 4 pasos tiene costo 16; resultado preferido tiene 6 pasos,
costo 6 y no entra en las tres celdas expuestas. Aceptar rodeo superior o inferior.
B-AC2: con penalización 0, resultado de 4 pasos y costo 4; la máscara no bloquea.
B-AC3: prueba del consumidor obtiene el rodeo con el perfil expuesto y conserva
el resultado unitario al desactivarlo. Percepción y memoria no se modificaron.

Fuera de alcance: exposición dinámica, probabilidades, nuevas coberturas o sensores.
Evidencia: cálculo del costo, ruta sin franja, penalización 0, prueba de consumidor
y revisión de archivos; registrar en evidencia.md.

### Traducción al proyecto (decisión C1/D2/A1/T1)

- Máscara de fixture: {x:1,y:1}, {x:2,y:1}, {x:3,y:1} → `Set(["1,1","2,1","3,1"])` vía `cellKey`.
- Costo de entrada: `entryCost = baseCost + penalty`, con `baseCost = 1` y `penalty = 4` si está
  enmascarada o `0` si no. El inicio no se cobra (se cobra al entrar a una celda destino).
- Perfil `EntryCostProfile` definido en `src/domain/navigation/search.ts` (A1). Se adapta el
  `findPathAStar` existente con perfil por defecto unitario; `findPathBfs` permanece sin cambios.
- Heurística Manhattan sin escalar; invariante: costo mínimo de entrada >= 1, que la mantiene
  admisible y consistente y hace innecesaria la reapertura del conjunto cerrado.
- BFS sigue siendo no ponderado e ignora el perfil (C1).
- Consumidor: `calculateRoute` en `src/application/simulation/navigationDemo.ts` propaga el perfil
  (D2). No se modifican `GameScene.ts` ni `labLevel.ts` (contexto).
- Declaración: `totalCost` pasa a ser la suma de costos de entrada; en modo unitario es idéntica
  a la cantidad de pasos (aristas).
- Pruebas (T1): `tests/navigation/exposure.test.ts` (máscara y costos) y
  `tests/application/navigationDemo.test.ts` (consumidor). Prueba enfocada:
  `npm run test:run -- tests/navigation`; validación: `npm run validate`.
- Costos verificados: ruta directa 4 pasos = 16; rodeo 6 pasos = 6 (superior o inferior,
  ambos aceptados); con penalización 0, 4 pasos = 4.