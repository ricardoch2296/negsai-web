---
name: colores-negsai
description: >-
  Punto de entrada para auditar o corregir colores en Negsai Web sin cargar el
  chat. Usar con /colores, /revisor-colores, /aplicar-colores, o cuando pidan
  revisar, arreglar, unificar o cambiar la paleta, tokens CSS o tema visual.
disable-model-invocation: true
---

# Colores Negsai (lanzador)

**No ejecutes auditorías ni ediciones de color en este chat.** El trabajo pesado va en un subagente aislado; aquí solo delegas y resumes el resultado.

## Comandos

| Invocación | Subagente | Comportamiento |
|------------|-----------|----------------|
| `/revisor-colores` o "audita colores" | `revisor-colores` | Solo informe; no editar |
| `/aplicar-colores` o "arregla/une colores" | `aplicar-colores` | Edita código según la guía |
| `/colores` sin más detalle | `revisor-colores` | Auditoría por defecto |

Si el usuario pide **cambiar** la paleta o **corregir** archivos → `aplicar-colores`. Si solo **revisar** → `revisor-colores`.

## Cómo delegar

1. Copia la petición del usuario (archivos, alcance, prioridades).
2. Llama al subagente con `Task` y `subagent_type` correspondiente.
3. En el `prompt` incluye:
   - Petición literal del usuario
   - Alcance (`todo src/`, archivos concretos, hallazgos previos si los hay)
   - Modo: `solo-informe` o `aplicar-correcciones`
4. Cuando termine el subagente, devuelve al usuario un **resumen breve** (3–6 líneas) y el informe o lista de cambios completos del subagente.

## Prohibido en este chat (skill)

- No hagas `grep` masivo de hex ni leas decenas de archivos tú mismo.
- No apliques `search_replace` de colores en el chat padre.
- No dupliques la paleta ni el checklist (están en `.cursor/agents/`).

## Referencia rápida

- Guía: `docs/theme.md`
- Tokens: `src/app/globals.css`
- Detalle de subagentes: `.cursor/agents/revisor-colores.md`, `.cursor/agents/aplicar-colores.md`
