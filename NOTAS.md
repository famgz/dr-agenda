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