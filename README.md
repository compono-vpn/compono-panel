# Compono Operator Panel

React/TypeScript operator panel for Compono VPN, derived from the Remnawave
frontend. Production is served at `https://panel.componovpn.com/` and uses the
panel-compatible routes exposed by `compono-api`.

## Backend contract

The UI still consumes `@remnawave/backend-contract` schemas. Any replacement
backend response must either match those schemas exactly or be normalized at
the API boundary before validation. In particular, list responses contain
expanded relations used by multiple screens (for example config-profile
`inbounds`/`nodes` and internal-squad `info`/`inbounds`). Returning lean database
rows makes the query fail validation and leaves the corresponding page loading.

The node metrics route carries tagged traffic and online-user counters but no
connection-status field. The dashboard's “Active Nodes” summary therefore uses
the canonical `/api/nodes` response (`isConnected && !isDisabled`); deriving it
from `usersOnline` incorrectly reports zero healthy nodes whenever nobody is
actively connected.

## Development

```bash
npm ci
npm run start:dev
```

The Xray config editor also needs the generated runtime files listed in
`Makefile`. Run `make download-monaco-deps` before a local production build.
They are Vite public assets and are served from `/wasm_exec.js`, `/main.wasm`,
`/xray.schema.json`, and `/xray.schema.cn.json`; the Docker build downloads them
automatically.

See `.env.sample` for the backend URL overrides used during API cutovers.
