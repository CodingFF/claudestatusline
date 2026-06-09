# Claude Code Mini Statusline

A tiny, zero-dependency statusline for [Claude Code](https://claude.com/claude-code). It shows, right under the input box:

```
advisor off | context 35% | 5h 24% resets 20:00 | weekly 78%
```

- **advisor on/off** — whether the `/advisor` tool is enabled (green when on)
- **ctx %** — how full your context window is (green → yellow at 60% → red at 85%)
- **5h %** — usage of your 5-hour limit and when it resets
- **wk %** — usage of your weekly limit

Works in any terminal (Windows Terminal, cmd, PowerShell, macOS/Linux). Only requires Node.js, which you almost certainly have if you use Claude Code.

## Install

1. Copy `statusline.js` into your `.claude` folder:
   - Windows: `C:\Users\<you>\.claude\statusline.js`
   - macOS/Linux: `~/.claude/statusline.js`

2. Add this to your `~/.claude/settings.json` (create the file if it doesn't exist):

   ```json
   {
     "statusLine": {
       "type": "command",
       "command": "node \"C:\\Users\\<you>\\.claude\\statusline.js\""
     }
   }
   ```

   On macOS/Linux use: `"command": "node ~/.claude/statusline.js"`

3. Restart Claude Code. Done.

## Notes

- `context` and the usage limits show up after the first message of a session — Claude Code only sends that data once the first API response arrives.
- Usage limits (`5h` / `wk`) only appear on Pro/Max subscriptions.
- Everything is in one small file; edit `statusline.js` to change colors, drop the weekly limit, add the model name, etc.
