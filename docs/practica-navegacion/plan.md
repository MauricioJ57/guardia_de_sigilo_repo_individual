# Plan — práctica de navegación
Estado: Aprobado
Variante: B
Spec: spec.md

| Incremento | Trabajo | Archivos reales | Criterios | Comprobación |
|---|---|---|---|---|
| 1 | Dominio y pruebas del fixture: perfil de costos de entrada en A* existente (por defecto unitario) y máscara expuesta; pruebas del caso normal y del límite | src/domain/navigation/search.ts; tests/navigation/exposure.test.ts (nuevo) | B-01, B-02, B-04, B-AC1, B-AC2 | npm run test:run -- tests/navigation |
| 2 | Conexión con el consumidor: calculateRoute propaga el perfil sin tocar GameScene.ts ni labLevel.ts; conservar el contrato unitario previo | src/application/simulation/navigationDemo.ts; tests/application/navigationDemo.test.ts (nuevo) | B-03, B-AC3, BASE-AC5 | npm run test:run |
| 3 | Validación final, diff y cierre de evidencia | docs/practica-navegacion/spec.md; docs/practica-navegacion/plan.md; docs/practica-navegacion/evidencia.md | BASE-AC1 a BASE-AC6 | npm run validate |

Referencia previa: comparación y casos comunes BASE-01 a BASE-04 completados (tests/navigation/commonFixture.test.ts; evidencia.md BASE-AC1..4).
Riesgos: (1) A* pasó de costo unitario fijo (search.ts) a costo de entrada por celda y totalCost a suma acumulada; el modo unitario se mantiene idéntico (sin regresión en tests/navigation/search.test.ts). (2) Manhattan sólo es admisible y consistente con costo mínimo de entrada >= 1; escalarla o bajarla de 1 rompería la optimalidad y la no reapertura del conjunto cerrado.
Detenerse si: faltan permisos; hay cambios ajenos en los archivos objetivo; conflicto de contrato en calculateRoute o SearchResult; regresión nueva en tests/navigation o tests/application; se requiere dependencia, UI o refactorización fuera del alcance; o el cambio toca percepción, memoria, FSM o controles.
No crear commits ni publicar automáticamente.
