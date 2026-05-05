# Playwright TypeScript POC (POM)

POC de automatización E2E en TypeScript usando Playwright + Page Object Model (POM), orientado a flujos reales de EventHub.

## Alcance del POC

- Migración de pruebas a TypeScript estricto (sin `any`).
- Patrón POM con separación por responsabilidades.
- Variables sensibles en `.env`.
- Linting con ESLint + TypeScript + Playwright plugin.
- Scripts para ejecución normal, paralela, headless y debug.
- Workflow de GitHub Actions simple y portable para CI/CD.

## Estructura

```text
.
├── .github/workflows/playwright.yml
├── pages/
│   ├── common/
│   │   └── BasePage.ts
│   └── eventhub/
│       ├── AdminEventsPage.ts
│       ├── BookingCheckoutPage.ts
│       ├── BookingDetailsPage.ts
│       ├── BookingsPage.ts
│       ├── EventsPage.ts
│       └── LoginPage.ts
├── support/
│   ├── config/environment.ts
│   ├── enums/
│   │   ├── refund-expectation.ts
│   │   └── ticket-quantity.ts
│   ├── interfaces/event.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── login-and-go-to-booking.ts
│   │   └── parsers.ts
├── tests/
│   └── ui-basics.spec.ts
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.js
├── .env.example
└── package.json
```

## Configuración local

1. Instalar dependencias:

```bash
npm ci
```

2. Crear `.env` desde `.env.example`:

```bash
cp .env.example .env
```

3. Completar credenciales reales en `.env`:

```env
BASE_URL=https://eventhub.rahulshettyacademy.com
EVENT_HUB_EMAIL=your-email@example.com
EVENT_HUB_PASSWORD=your-password
BOOKING_FULL_NAME=QA Automation User
BOOKING_PHONE=+57 3001234567
```

## Scripts

- Todos los scripts `test*` ejecutan `npm run lint` antes de lanzar Playwright.
- Ejecución estándar: `npm test`
- Ejecución normal (headed): `npm run test:normal`
- Ejecución paralela: `npm run test:parallel`
- Ejecución headless: `npm run test:headless`
- Debug interactivo: `npm run test:debug`
- CI: `npm run test:ci`
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`

## Best practices aplicadas de POM

- Cada página abstrae locators y acciones de negocio.
- Los tests solo orquestan flujo y aserciones clave.
- Reuso de helpers de workflow (`loginAndGoToBooking`).
- Utilidades puras para parsing y fechas.
- Enums para evitar magic numbers/strings.
- Interfaces explícitas para contratos de datos (`EventDraft`, `SeatSnapshot`).

### Ventajas de POM

| Ventaja | Impacto en QA | Ejemplo en este POC |
|---|---|---|
| Mantenibilidad | Cambios de UI se corrigen en una sola clase | `BookingDetailsPage.ts` concentra selectores de refund |
| Reusabilidad | Menos duplicación entre casos | `loginAndGoToBooking.ts` se usa en varios tests |
| Legibilidad | Casos de prueba expresan intención, no detalles DOM | `Assignment 2/3` usan métodos de alto nivel |
| Escalabilidad | Fácil agregar nuevas páginas/flujos | Carpeta `pages/eventhub` por dominio |
| Estabilidad | Menos flaky tests por selectores y esperas centralizadas | `assertLoaded()` y métodos encapsulados |

## Comparación de 4 patrones de diseño de pruebas

| Patrón | Cuándo usar | Fiabilidad | Seguridad | Usabilidad | Mantenibilidad | Escalabilidad |
|---|---|---|---|---|---|---|
| POM | UI flows medianos/grandes | Alta | Media | Alta | Alta | Alta |
| Data-Driven | Validar muchas combinaciones de datos | Alta | Alta (si datos externos seguros) | Media | Alta | Alta |
| Screenplay | Suites grandes con múltiples roles/acciones | Muy alta | Media | Media | Muy alta | Muy alta |
| API + UI Hybrid | Validación rápida y robusta end-to-end | Muy alta | Alta | Media | Alta | Muy alta |

### Cómo mejoran estos patrones

- Fiabilidad: menor duplicación, esperas y parsing centralizados.
- Seguridad: secretos por entorno, no hardcode en tests.
- Usabilidad: pruebas legibles para QA, Dev y SDET.
- Observabilidad: fallos más trazables por capas.
- Time-to-fix: ubicación clara del problema (Page, Workflow o Test).

## Estrategia para Data-Driven en este POC (futuro)

- Mantener POM como base.
- Agregar datasets versionados (JSON/CSV o generadores tipados).
- Ejecutar con `test.describe.parallel` + ids de datos.
- Normalizar datos sensibles con variables de entorno o vault.

## Guía para API testing futuro (sin implementarlo aún)

Patrón recomendado:

- `api/client`: cliente HTTP tipado por dominio.
- `api/contracts`: interfaces/types de request/response.
- `api/services`: operaciones de negocio (crear evento, reservar, cancelar).
- `tests/api`: tests puros API.
- `tests/e2e`: tests UI, opcionalmente precondiciones por API.

Buenas prácticas:

- Contratos tipados y validación de schema.
- Idempotencia en setup/teardown.
- Correlation IDs y logs de request/response.
- Reintentos solo en fallos transitorios (timeouts/5xx).

## CI/CD portable (GitHub, Azure DevOps, otros)

Este POC está listo para mover a cualquier pipeline con estos pasos:

1. Node 20.
2. `npm ci`.
3. `npx playwright install --with-deps chromium`.
4. `npm run lint`.
5. `npm run test:ci`.
6. Publicar `test-results/` y `playwright-report/` solo en fallo.

Variables esperadas:

- `BASE_URL`
- `EVENT_HUB_EMAIL`
- `EVENT_HUB_PASSWORD`
- `BOOKING_FULL_NAME`
- `BOOKING_PHONE`

## AI para QA en este proyecto (visión futura)

### GEN AI vs AI clásica (aplicado a QA)

- AI clásica/ML: modelos predictivos específicos (clasificación, regresión, anomalías).
- Gen AI: genera contenido nuevo (casos de prueba, datos, código, resúmenes de fallos).

Aplicación práctica:

- AI clásica: priorización de riesgo de suites, predicción de flaky tests.
- Gen AI: generación asistida de escenarios, refactor de POM, análisis de reportes.

### LLM y otros modelos comunes

- LLM: modelos de lenguaje para texto/código; útiles para diseño de tests, RCA y documentación.
- SLM (small language models): menor costo/latencia, útiles para tasks acotadas en CI.
- Modelos de visión: validación visual/UI diffs, OCR.
- Modelos de forecasting/anomaly: detección de degradación y flaky behavior.

## Guía para integrar Agents/Skills (sin implementarlo aún)

Objetivo QA:

- Agent de análisis de fallos de Playwright report.
- Agent para sugerir selectores robustos.
- Skill para generar tests desde historias de usuario.
- Skill para validar convenciones POM/ESLint.

Estrategia recomendada:

1. Definir casos de uso QA concretos (triage, generación, mantenimiento).
2. Limitar permisos del agente por repo/rutas.
3. Registrar prompts/versiones y medir impacto.
4. Revisar salidas de agente vía PR y lint/test gates.

Dónde investigar:

- Documentación oficial Playwright Test.
- Documentación TypeScript ESLint.
- Documentación de agentes/skills de tu plataforma (GitHub Copilot, Azure AI, etc.).
- Patrones Screenplay y arquitectura de test automation.

## Integración con Jira/Azure Tickets y estrategia Git

### Flujo recomendado

- Rama por ticket (`feature/QA-123-refund-flow`).
- Commits pequeños con referencia al ticket.
- PR con evidencia automática (lint + test + artifacts de fallo).
- Merge por política de branch protection.

### Git strategy sugerida

- GitFlow simplificado:
  - `main`: estable.
  - `develop` (opcional): integración continua.
  - `feature/*`: cambios por historia/ticket.
  - `hotfix/*`: correcciones urgentes.

### Trazabilidad ticket -> test

- Naming consistente en tests.
- Etiquetas por dominio (`@eventhub`, `@refund`, etc. si se requiere).
- Plantillas de PR con checklist QA.

## Nota de seguridad

- Nunca commitear `.env` real en repositorio remoto.
- En CI/CD usar secretos del proveedor (GitHub Secrets, Azure Variable Groups/Key Vault, etc.).
