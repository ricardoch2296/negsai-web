#!/usr/bin/env node
/**
 * Bloquea git add y git commit hasta que el usuario apruebe explícitamente.
 * Recibe JSON por stdin (evento beforeShellExecution) y responde con permission.
 */

const fs = require("fs");

const GIT_ADD = /\bgit(?:\.exe)?\s+add\b/i;
const GIT_COMMIT = /\bgit(?:\.exe)?\s+commit\b/i;

function readStdin() {
  if (process.stdin.isTTY) return "";
  try {
    return fs.readFileSync(0, "utf8").replace(/^\uFEFF/, "").trim();
  } catch {
    return "";
  }
}

function respond(payload) {
  process.stdout.write(JSON.stringify(payload));
}

function askFor(command, operation) {
  const labels = {
    add: {
      user_message:
        "El agente quiere ejecutar git add. ¿Apruebas añadir estos archivos al staging? Revisa qué se va a incluir antes de aceptar.",
      agent_message:
        "git add requiere aprobación explícita del usuario. No ejecutes el comando hasta que lo apruebe.",
    },
    commit: {
      user_message:
        "El agente quiere ejecutar git commit. ¿Apruebas este commit? Revisa el mensaje y los archivos antes de aceptar.",
      agent_message:
        "git commit requiere aprobación explícita del usuario. No ejecutes el comando hasta que lo apruebe.",
    },
  };

  respond({
    permission: "ask",
    ...labels[operation],
  });
}

function detectGitOperation(text) {
  if (GIT_COMMIT.test(text)) return "commit";
  if (GIT_ADD.test(text)) return "add";
  return null;
}

function main() {
  const raw = readStdin();
  let command = raw;

  if (raw.startsWith("{")) {
    try {
      const input = JSON.parse(raw);
      command = input.command ?? raw;
    } catch {
      const fallback = detectGitOperation(raw);
      if (fallback) {
        askFor(raw, fallback);
        return;
      }
      respond({
        permission: "ask",
        user_message:
          "El agente quiere ejecutar una operación git. ¿Apruebas continuar?",
        agent_message:
          "Operación git detectada pero el hook no pudo leer el comando completo. Pide aprobación al usuario.",
      });
      return;
    }
  }

  const operation = detectGitOperation(command);
  if (operation) {
    askFor(command, operation);
    return;
  }

  respond({ permission: "allow" });
}

main();
