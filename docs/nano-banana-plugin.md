# Nano Banana Plugin (Gemini image generation)

This repo enables the [Nano Banana](https://github.com/Ibrahim-3d/nano-banana-claude-plugin)
Claude Code plugin — AI image generation and editing via Google's Gemini image
models (`gemini-3.1-flash-image-preview`, `gemini-3-pro-image-preview`).

It is registered in `.claude/settings.json` (marketplace `ibrahim-plugins`,
plugin `nano-banana@ibrahim-plugins`), so Claude Code will offer it automatically
in sessions on this repo.

## Commands / tools

- `/genimage <prompt>` — generate an image (supports `--aspect-ratio`,
  `--resolution 1K|2K|4K`, and `--images` for editing / multi-reference).
- `/nano-banana:setup <KEY>` — store the Gemini API key.

## One-time setup in a fresh session

The plugin is a Python plugin, so a new (ephemeral) environment needs three things:

1. **Python dependencies**

   ```bash
   pip3 install google-genai python-dotenv Pillow
   ```

2. **Gemini API key.** Get one at https://aistudio.google.com/apikey, then run:

   ```
   /nano-banana:setup YOUR_KEY
   ```

   The key is written to the plugin's own `scripts/.env` (gitignored inside the
   plugin) — it is never committed to this repo.

3. **hooks.json patch (upstream bug, plugin v2.1.0).** The plugin ships a
   `SessionStart` hook in the wrong schema, which makes Claude Code report the
   plugin as *"failed to load"*. Until upstream fixes it, patch the installed
   copy so each `SessionStart` entry wraps its command in a nested `hooks` array:

   ```json
   {
     "hooks": {
       "SessionStart": [
         { "hooks": [ { "type": "command", "command": "python \"$CLAUDE_PLUGIN_ROOT/scripts/check_env.py\"" } ] }
       ]
     }
   }
   ```

   The file lives at
   `~/.claude/plugins/cache/ibrahim-plugins/nano-banana/<version>/hooks/hooks.json`.

## Quota note

Image generation on `gemini-3.1-flash-image` / `gemini-3-pro-image` is **not**
available on the Gemini free tier (`limit: 0`). A `429 RESOURCE_EXHAUSTED` when
generating means the key's Google Cloud project needs billing / paid-tier quota
enabled for these image models — it is not a plugin problem.
