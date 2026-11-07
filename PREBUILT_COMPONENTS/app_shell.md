Install the @efferd/app-shell-4 block into this project.

Steps:
1. Install the shadcn skill if missing: npx skills add shadcn/ui
2. Ensure this is a shadcn project (has components.json). If not, run: npx shadcn@latest init
3. Add the @efferd registry to components.json (if missing):
{
  "registries": {
    "@efferd": "https://efferd.com/r/{style}/{name}.json"
  }
}
4. Run: npx shadcn@latest add @efferd/app-shell-4

After install, summarize what was added and any next steps.

## EXTRA NOTE
this dashboard has left sidebar, a good looking app shell, a search bar, NO BREADCRUMBS NO RIGHT SIDE DRAWER.