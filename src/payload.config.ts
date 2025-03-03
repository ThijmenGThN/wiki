import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'

import { migrations } from './migrations'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Settings } from './collections/Settings'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'Payload Wiki',
      description: "A customizable knowledge base.",
    }
  },
  collections: [
    Users,
    Pages,
    Categories
  ],
  globals: [
    Settings
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    prodMigrations: migrations,
    client: {
      url: 'file:./database/wiki.db',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
  ],
})
