#!/usr/bin/env node
/**
 * Protege cambios en la base de datos.
 * - preToolUse: "deny" en mutaciones MCP (único modo que bloquea de verdad en Cursor)
 * - beforeShellExecution: "ask" (diálogo Aceptar/Rechazar, como git)
 * Nota: "ask" en MCP no muestra diálogo ni bloquea — solo aparece en el log.
 */

const fs = require("fs");
const path = require("path");

const READ_ONLY_MCP_TOOLS = new Set([
  "list_tables",
  "list_migrations",
  "list_extensions",
  "get_logs",
  "get_advisors",
  "search_docs",
  "generate_typescript_types",
  "get_project_url",
  "get_publishable_keys",
  "list_edge_functions",
  "get_edge_function",
  "list_storage_buckets",
  "get_storage_config",
  "list_branches",
]);

const MUTATING_MCP_TOOLS = new Set([
  "apply_migration",
  "update_storage_config",
  "deploy_edge_function",
  "create_branch",
  "delete_branch",
  "merge_branch",
  "reset_branch",
  "rebase_branch",
]);

const WRITE_SQL =
  /^\s*(INSERT|UPDATE|DELETE|TRUNCATE|DROP|CREATE|ALTER|GRANT|REVOKE|REPLACE|MERGE|CALL|DO\b|COPY\b|COMMENT\s+ON|REFRESH\s+MATERIALIZED|VACUUM|REINDEX|CLUSTER)\b/i;

const READ_SQL =
  /^\s*(SELECT|EXPLAIN|SHOW|DESCRIBE|DESC|WITH|TABLE|VALUES)\b/i;

const SHELL_DB_MUTATION =
  /\b(supabase(?:\.exe)?\s+(?:db\s+)?(?:push|reset|migrate|diff|lint)|supabase(?:\.exe)?\s+migration\s+(?:new|up|repair|squash)|npx\s+supabase\s+(?:db\s+)?(?:push|reset|migrate|diff)|psql(?:\.exe)?\b)/i;

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

function auditLog(input, output) {
  try {
    const logPath = path.join(process.cwd(), ".cursor", "hooks", "approve-db-ops.log");
    fs.appendFileSync(
      logPath,
      `${JSON.stringify({
        ts: new Date().toISOString(),
        event: input.hook_event_name ?? "",
        tool_name: input.tool_name ?? "",
        output,
      })}\n`
    );
  } catch {
    // ignore
  }
}

function finish(input, payload) {
  auditLog(input, payload);
  respond(payload);
}

function parseInput(raw) {
  if (!raw.startsWith("{")) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseToolInput(toolInput) {
  if (!toolInput) return {};
  if (typeof toolInput === "object") return toolInput;
  try {
    return JSON.parse(toolInput);
  } catch {
    return {};
  }
}

function normalizeToolName(name) {
  const value = String(name ?? "").trim();
  if (value.startsWith("MCP:")) {
    const withoutPrefix = value.slice(4);
    const slashIndex = withoutPrefix.lastIndexOf("/");
    if (slashIndex >= 0) return withoutPrefix.slice(slashIndex + 1);
    return withoutPrefix;
  }
  return value;
}

function resolveMcpCall(input) {
  const rawToolName = input.tool_name ?? "";
  const toolInput = parseToolInput(input.tool_input);

  if (rawToolName === "CallMcpTool" || toolInput.toolName) {
    return {
      toolName: normalizeToolName(toolInput.toolName ?? ""),
      params: parseToolInput(toolInput.arguments ?? {}),
    };
  }

  return {
    toolName: normalizeToolName(rawToolName),
    params: toolInput,
  };
}

function stripSqlComments(sql) {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();
}

function isMutatingSql(query) {
  if (!query || typeof query !== "string") return true;
  const statements = stripSqlComments(query)
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  if (statements.length === 0) return true;
  return statements.some((statement) => {
    if (WRITE_SQL.test(statement)) return true;
    if (READ_SQL.test(statement)) return false;
    return true;
  });
}

function summarizeSql(query) {
  const oneLine = stripSqlComments(query).replace(/\s+/g, " ").trim();
  if (oneLine.length <= 120) return oneLine;
  return `${oneLine.slice(0, 117)}...`;
}

function getMutatingReason(toolName, params) {
  if (READ_ONLY_MCP_TOOLS.has(toolName)) return null;

  if (toolName === "execute_sql") {
    const query = params.query ?? "";
    if (!isMutatingSql(query)) return null;
    return {
      user_message: `Cambio en base de datos bloqueado.\n\nSQL:\n${summarizeSql(query)}\n\nCursor no muestra diálogo Aceptar/Rechazar para MCP. Para autorizar, ejecuta el SQL tú en Supabase o desactiva temporalmente el hook en Settings → Hooks.`,
      agent_message:
        "Mutación MCP bloqueada por hook. No reintentes sin confirmación explícita del usuario en el chat.",
    };
  }

  if (toolName === "apply_migration") {
    const name = params.name ?? "(sin nombre)";
    return {
      user_message: `Migración "${name}" bloqueada. Autorízala manualmente en Supabase o desactiva el hook en Settings → Hooks.`,
      agent_message: "apply_migration bloqueado por hook de seguridad.",
    };
  }

  if (MUTATING_MCP_TOOLS.has(toolName)) {
    return {
      user_message: `Operación "${toolName}" bloqueada. Autorízala manualmente o desactiva el hook en Settings → Hooks.`,
      agent_message: `Herramienta MCP ${toolName} bloqueada por hook de seguridad.`,
    };
  }

  return null;
}

function isMcpCall(input) {
  const raw = input.tool_name ?? "";
  return raw === "CallMcpTool" || raw.startsWith("MCP:") || input.hook_event_name === "beforeMCPExecution";
}

function handleMcp(input) {
  const { toolName, params } = resolveMcpCall(input);
  const reason = getMutatingReason(toolName, params);

  if (!reason) {
    finish(input, { permission: "allow" });
    return;
  }

  finish(input, {
    permission: "deny",
    user_message: reason.user_message,
    agent_message: reason.agent_message,
  });
}

function handleShell(input, command) {
  if (!SHELL_DB_MUTATION.test(command)) {
    finish(input, { permission: "allow" });
    return;
  }

  finish(input, {
    permission: "ask",
    user_message: `El agente quiere ejecutar un comando que puede modificar la base de datos:\n\n${command}\n\n¿Apruebas continuar?`,
    agent_message:
      "Comando de base de datos detectado. Requiere aprobación explícita del usuario.",
  });
}

function main() {
  const raw = readStdin();
  const input = parseInput(raw) ?? {};

  if (input.tool_name && isMcpCall(input)) {
    handleMcp(input);
    return;
  }

  if (input.tool_name) {
    finish(input, { permission: "allow" });
    return;
  }

  if (input.command) {
    handleShell(input, input.command);
    return;
  }

  finish(input, { permission: "allow" });
}

main();
