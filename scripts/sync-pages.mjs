import { cp, mkdir, rm } from 'node:fs/promises'

// Replace hashed bundles, then refresh the published files. The legacy image
// folder also contains owner-supplied originals that are absent from dist.
await mkdir('docs', { recursive: true })
await rm('docs/assets', { recursive: true, force: true })
await cp('dist', 'docs', { recursive: true })
