/*
 * Copyright JFX 2021
 * MIT License
 */

/*
 * Options storage for markdown-here-revival
 *
 * Requires https://github.com/fregante/webext-options-sync
 */

import { fetchExtFile } from "../wxfetch.mjs"
import OptionsSync from "./mailext-options-sync.js"
import {
  migrate_badMathValue,
  migrate_MainCSS,
  migrate_oldHotKey,
  migrate_oldOptions,
  migrate_syntaxCSS,
  migrate_smartReplacements,
  migrate_removeUnused,
  migrate_mathRenderer,
  migrate_mathRenderer2,
  migrate_macHotkeys,
  migrate_mathCodecogs,
} from "./options_migration.js"

function hotKeyDefault() {
  if (navigator.platform === "MacIntel") {
    return "MacCtrl+Command+M"
  }
  return "Ctrl+Alt+M"
}

export const kOptDefaults = {
  "main-css": "",
  "syntax-css": "nnfx-light.css",
  "math-value":
    '<img src="https://latex.codecogs.com/png.image?\\inline&space;\\bg{white}&space;\\fg{black}&space;\\dpi{200}&space;{urlmathcode}" alt="{mathcode}">',
  "math-renderer-enabled": false,
  "math-renderer": "texzilla",
  "hotkey-input": hotKeyDefault(),
  "gfm-line-breaks-enabled": true,
  "forgot-to-render-check-enabled": true,
  "smart-replacements-enabled": true,
  "emoji-shortcode-enabled": true,
  "emoji-autocomplete-enabled": true,
  "buglink-enabled": false,
  "buglink-url": "https://bugzil.la/{bug_number}",
  "buglink-text": "Bug {bug_number}",
  "last-version": "0",
  "preview-width": 0,
  "saved-preview-width": 0,
  "enable-markdown-mode": true,
  "mdhr-mode": "modern",
  "use-bodytext-enabled": true,
}

let MIGRATIONS = [
  migrate_oldHotKey,
  migrate_oldOptions,
  migrate_syntaxCSS,
  migrate_badMathValue,
  migrate_MainCSS,
  migrate_smartReplacements,
  migrate_mathRenderer,
  migrate_mathRenderer2,
  migrate_macHotkeys,
  migrate_mathCodecogs,
  migrate_removeUnused,
]

export function MDHROptionsMigrate() {
  return MDHROptionsStore()
}

function MDHROptionsStore() {
  let DEFAULTS = Object.assign({}, kOptDefaults)

  // Start fetching the default CSS immediately. We patch _runMigrations and
  // _getAll below to wait for it, preventing the race where an empty
  // "main-css" default is stored before the fetch completes.
  const cssReady = fetchExtFile("/default.css").then((css) => {
    DEFAULTS["main-css"] = css
  })

  const store = new OptionsSync({
    defaults: DEFAULTS,
    migrations: MIGRATIONS,
    logging: false,
  })

  // Ensure migrations always have the real CSS default
  const origRunMigrations = store._runMigrations.bind(store)
  store._runMigrations = async function (migrations) {
    await cssReady
    return origRunMigrations(migrations)
  }

  // Ensure getAll / _getAll have the real CSS default
  const orig_getAll = store._getAll.bind(store)
  store._getAll = async function () {
    await cssReady
    return orig_getAll()
  }

  return store
}

export const OptionsStore = MDHROptionsStore()
export default OptionsStore
