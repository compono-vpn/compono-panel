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

## Development

```bash
npm ci
npm run start:dev
```

See `.env.sample` for the backend URL overrides used during API cutovers.
