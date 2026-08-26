## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Publishing

After each completed project update, update both GitHub and GitHub Pages:

1. Run the relevant validation command, usually `npm run build`.
2. Review `git status` and stage only the files changed for the current task.
3. Commit the completed update with a concise message.
4. Push to `origin/main` so the existing GitHub Pages workflow deploys the site.
5. If possible, verify that the Pages deployment was triggered or completed.

Do not stage unrelated local or untracked files unless the user explicitly asks for them to be included.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
