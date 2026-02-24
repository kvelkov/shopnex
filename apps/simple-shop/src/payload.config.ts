// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite' // database-adapter-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { plugins } from './plugins'
import { Orders } from './collections/Orders/Orders'
import { Collections } from './collections/Collections'
import { Products } from './collections/Products/Products'
import { Policies } from './collections/Policies'
import { GiftCards } from './collections/GiftCards'
import { Payments } from './collections/Payments'
import { Locations } from './collections/Locations'
import { Shipping } from './collections/Shipping'
import { Pages } from './collections/Pages/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/admin',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Orders,
    Collections,
    Products,
    Users,
    Media,
    Policies,
    GiftCards,
    Pages,
    Payments,
    Locations,
    Shipping,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
})
