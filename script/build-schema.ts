#!/usr/bin/env bun
import { createOhMyOpenCodeJsonSchema, createTalosJsonSchema } from "./build-schema-document"

const SCHEMA_OUTPUT_PATH = "assets/oh-my-opencode.schema.json"
const DIST_SCHEMA_OUTPUT_PATH = "dist/oh-my-opencode.schema.json"
const TALOS_SCHEMA_OUTPUT_PATH = "assets/talos.schema.json"
const TALOS_DIST_SCHEMA_OUTPUT_PATH = "dist/talos.schema.json"

/** Talos-only agent keys that should not appear in the upstream OMO schema */
const TALOS_ONLY_AGENTS = ["argus"]

function stripTalosOnlyAgents(schema: Record<string, unknown>): Record<string, unknown> {
  const clone = structuredClone(schema)
  const agents = (clone as Record<string, Record<string, Record<string, Record<string, unknown>>>>)
    ?.properties?.agents?.properties
  if (agents) {
    for (const key of TALOS_ONLY_AGENTS) {
      delete agents[key]
    }
  }
  return clone
}

async function main() {
  console.log("Generating JSON Schema...")

  const talosSchema = createTalosJsonSchema()
  await Bun.write(TALOS_SCHEMA_OUTPUT_PATH, JSON.stringify(talosSchema, null, 2))
  await Bun.write(TALOS_DIST_SCHEMA_OUTPUT_PATH, JSON.stringify(talosSchema, null, 2))
  console.log(`✓ Talos Schema generated: ${TALOS_SCHEMA_OUTPUT_PATH}`)

  // OMO schema — upstream-clean, no talos-only agents
  const omoSchema = stripTalosOnlyAgents(createOhMyOpenCodeJsonSchema())
  await Bun.write(SCHEMA_OUTPUT_PATH, JSON.stringify(omoSchema, null, 2))
  await Bun.write(DIST_SCHEMA_OUTPUT_PATH, JSON.stringify(omoSchema, null, 2))
  console.log(`✓ OMO Schema generated: ${SCHEMA_OUTPUT_PATH}`)
}

main()
