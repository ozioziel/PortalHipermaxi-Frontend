# 🛒 Asistente Maxi — Prototipo InnovaHack 2026

Prototipo original del **agente inteligente para el Portal de Proveedores
de Hipermaxi**, desarrollado por el equipo **NexoLab** durante
**InnovaHack 2026**.

La solución fue diseñada para asistir a proveedores mediante una
interfaz conversacional por **texto y voz**, utilizando inteligencia
artificial para guiarlos durante distintos procesos dentro del portal.

🏆 **NexoLab obtuvo el primer lugar general de InnovaHack 2026 con esta solución.**

---

## 🚀 Evolución del proyecto

Este repositorio corresponde a la **primera etapa del proyecto**:
el prototipo desarrollado para validar la idea durante InnovaHack.

Después de la competencia, el proyecto continuó evolucionando con el
objetivo de facilitar su integración con sistemas empresariales
existentes.

La arquitectura actual separa el asistente del portal mediante un
**widget embebible**, evitando que la lógica del asistente tenga que
incorporarse directamente al frontend de la aplicación anfitriona.

### Proyecto actual

👉 **HyperFlow / Hipermaxi Innova**

https://github.com/daniel69zz/hipermaxi_innova

El repositorio actual contiene:

- Portal utilizado como entorno de pruebas.
- Widget embebible HyperFlow.
- Backend para chat, voz y herramientas.
- Sistema de autenticación y rate limiting.
- Microservicio RAG en Python.
- Integración del asistente mediante JavaScript.

---

## 💡 Problema

El Portal de Proveedores de Hipermaxi contiene diferentes procesos
operativos que pueden requerir conocimiento previo o asistencia por
parte del equipo de soporte.

La propuesta buscó reducir esa fricción mediante un agente inteligente
capaz de acompañar al usuario mientras utiliza el portal.

El asistente puede proporcionar orientación contextual utilizando
documentación y manuales como fuente de conocimiento.

---

## 🤖 Solución

El prototipo plantea un asistente integrado dentro de la experiencia
del Portal de Proveedores.

Entre las funcionalidades planteadas se encuentran:

- Asistencia mediante texto.
- Interacción mediante voz.
- Orientación contextual dentro del portal.
- Consulta de una base de conocimiento.
- Ayuda durante procesos operativos.
- Automatización y asistencia sobre elementos de la interfaz.

---

## 🧪 Etapa 1 — Prototipo InnovaHack

Este repositorio contiene el frontend utilizado durante la etapa
inicial del proyecto.

Durante esta fase se desarrolló una representación funcional del
Portal de Proveedores que permitió:

- Diseñar y validar la experiencia de usuario.
- Integrar el concepto inicial del asistente.
- Probar la interacción dentro del portal.
- Presentar una demostración funcional durante InnovaHack.
- Validar la propuesta frente al reto planteado por Hipermaxi.

### Tecnologías

- React
- TypeScript
- Vite
- React Router
- Recharts
- CSS

---

## 🏗️ Etapa 2 — HyperFlow

Después de InnovaHack, el proyecto fue rediseñado para que el
asistente pudiera integrarse de manera más desacoplada.

En lugar de modificar directamente el frontend de una aplicación
existente, HyperFlow funciona como un **widget independiente** que
puede ser cargado desde el sistema anfitrión.

```text
Portal existente
       │
       │ <script>
       ▼
HyperFlow Widget
       │
       ▼
HyperFlow API
       │
       ├── Chat / agente
       ├── Voz
       ├── Herramientas
       │
       └── RAG
              │
              ▼
        Base de conocimiento
```

Esta arquitectura permite separar la evolución del asistente de la
aplicación donde será integrado.

El código de esta etapa se encuentra en:

👉 https://github.com/daniel69zz/hipermaxi_innova

---

## 🧠 RAG

La versión evolucionada de HyperFlow incorpora un microservicio en
Python para recuperación semántica de información.

El sistema utiliza documentación como fuente de conocimiento para
recuperar información relevante antes de generar una respuesta.

```text
Pregunta
   ↓
Backend
   ↓
RAG Python
   ↓
Documentación
   ↓
Contexto relevante
   ↓
Agente
   ↓
Respuesta
```

---

## 🧩 Widget embebible

Uno de los principales cambios después del prototipo fue transformar
el asistente en un widget independiente.

El objetivo es poder integrarlo en una aplicación existente de forma
similar a:

```html
<script src="widget.js"></script>
```

De esta forma, el asistente mantiene su propia lógica y componentes,
reduciendo el acoplamiento con el frontend anfitrión.

---

## 🏆 InnovaHack 2026

**InnovaHack 2026** reunió equipos multidisciplinarios para resolver
desafíos tecnológicos reales planteados por empresas y organizaciones
bolivianas.

NexoLab trabajó sobre el reto presentado por **Hipermaxi**.

La propuesta obtuvo:

🥇 **Primer lugar general — InnovaHack 2026**

El proyecto presentó un agente inteligente para asistir a proveedores
mediante voz y texto mientras utilizan el portal.

---

## 👥 Proyecto colaborativo

Este proyecto fue desarrollado por **NexoLab** como un trabajo en equipo.

Este repositorio conserva una de las primeras implementaciones del
prototipo.

El desarrollo y arquitectura actuales se encuentran en el repositorio
principal del equipo:

🔗 https://github.com/daniel69zz/hipermaxi_innova

---

## 👨‍💻 Mi participación

Participé en el desarrollo del prototipo presentado durante
InnovaHack 2026 y continúo participando en la evolución de la solución.

> Esta sección debe detallar únicamente las partes que desarrollé o en
> las que participé directamente.

<!--
Ejemplo:
- Desarrollo de ...
- Implementación de ...
- Diseño de ...
- Integración de ...
- Pruebas y despliegue de ...
-->

---

## ⚙️ Ejecución del prototipo

Clonar el repositorio:

```bash
git clone https://github.com/ozioziel/PortalHipermaxi-Frontend.git
cd PortalHipermaxi-Frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Construir para producción:

```bash
npm run build
```

---

## 🔗 Repositorios

### Prototipo original

https://github.com/ozioziel/PortalHipermaxi-Frontend

### Desarrollo actual — HyperFlow

https://github.com/daniel69zz/hipermaxi_innova

---

## 👨‍💻 Autor / colaborador

**Oziel Rodman Ramos Torrez**

GitHub: https://github.com/ozioziel
