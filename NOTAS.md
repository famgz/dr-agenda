# FSW Dr. Agenda

https://github.com/felipemotarocha/doutor-agenda

https://www.figma.com/design/0G9SAhJsDPpb9mXORSxxY3/dr.agenda?node-id=29-588&p=f&t=xREk9BhFFGlUQjbs-0

`npx create-next-app@latest dr-agenda`


## Lint

`npm i -D prettier prettier-plugin-tailwindcss` add to .prettierrc { "plugins": ["prettier-plugin-tailwindcss"] }

`npm i -D eslint-plugin-simple-import-sort` add to eslint.config { plugins: { "simple-import-sort": simpleImportSort, }, rules: { "simple-import-sort/imports": "error", "simple-import-sort/exports": "error", }, },


## DB

`npm i drizzle-orm pg dotenv`

`npm i -D drizzle-kit tsx @types/pg`

`npx drizzle-kit push` after set schema

`npx drizzle-kit studio`


## Shadcn

`npx shadcn@latest init`

`npx shadcn@latest add button`

`npx shadcn@latest add tabs`

`npx shadcn@latest add card`

`npx shadcn@latest add input label`

`npx shadcn@latest add form`

`npx shadcn@latest add sonner`

`npx shadcn@latest add alert-dialog`

`npx shadcn@latest add sidebar`

`npx shadcn@latest add dialog`

`npx shadcn@latest add select`

`npx shadcn@latest add badge`

`npx shadcn@latest add separator`

`npx shadcn@latest add table`

`npm install @tanstack/react-table`

`npx shadcn@latest add dropdown-menu`



## Auth

`npm i better-auth`

`npx @better-auth/cli@latest generate`


## Format

`npm i react-number-format`


## Actions

`npm i next-safe-action`