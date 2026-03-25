import { readFileSync } from "node:fs"
import { join } from "node:path"
import { detectConfigFile, getOpenCodeConfigPaths, parseJsonc } from "../../../shared"
import type { OmoConfig } from "./model-resolution-types"

const PACKAGE_NAME = "talos"
const LEGACY_PACKAGE_NAME = "oh-my-opencode"
const USER_CONFIG_DIR = getOpenCodeConfigPaths({ binary: "opencode", version: null }).configDir

function tryLoadConfig(basePath: string): OmoConfig | null {
  const detected = detectConfigFile(basePath)
  if (detected.format === "none") return null
  try {
    const content = readFileSync(detected.path, "utf-8")
    return parseJsonc<OmoConfig>(content)
  } catch {
    return null
  }
}

export function loadOmoConfig(): OmoConfig | null {
  return (
    tryLoadConfig(join(process.cwd(), ".opencode", PACKAGE_NAME)) ??
    tryLoadConfig(join(process.cwd(), ".opencode", LEGACY_PACKAGE_NAME)) ??
    tryLoadConfig(join(USER_CONFIG_DIR, PACKAGE_NAME)) ??
    tryLoadConfig(join(USER_CONFIG_DIR, LEGACY_PACKAGE_NAME))
  )
}
