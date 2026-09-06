import { cp, mkdir, rm } from 'node:fs/promises'

// Keep the legacy /docs Pages source identical to the Actions artifact.
// Preserve the Markdown documentation alongside the generated website.
await mkdir('docs', { recursive: true })
for (const directory of ['assets', 'images', 'brand']) {
  await rm(`docs/${directory}`, { recursive: true, force: true })
}
await cp('dist', 'docs', { recursive: true })
