import { v7 as uuidV7 } from "uuid";

/** Identificador ordenable por tiempo (RFC 9562) para filas en Supabase. */
export function newUuidV7(): string {
  return uuidV7();
}
