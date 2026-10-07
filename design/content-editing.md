# Editing the Website

Admin sign-in opens `/blog`. Use the normal Blog, Travel, Projects, About,
and YouTube pages; New/Edit controls appear only for allowlisted admins.
The old `/admin/dashboard` address redirects authenticated admins to `/blog`.
Public navigation, layouts, and authentication remain in place.

## Content and Media

- Blog, travel, and project editors support Markdown, a cover image, a photo
  gallery, MP4 videos, publication state, and their page-specific fields.
- About supports the name, headline, biography, profile image, and social links.
- Save persists content in Cosmos DB; delete removes the content record.
- Unpublished records appear only in admin content responses. Failed saves keep
  the editor draft open. Unsaved drafts are not persisted across browser reloads.
- Images accept JPEG, PNG, and WebP up to 20MB. Videos accept MP4 up to 100MB.
  File signatures are checked before uploading to Blob Storage.
- Uploaded media is served through `/api/media/{name}`, including byte ranges
  for video playback. The Blob container can remain private. Media URLs are
  publicly readable, even when referenced by a draft; do not upload confidential
  material. Removing a media reference or deleting a story does not delete the
  underlying blob, since another record may reference it.

## Azure Settings

Set these in the existing Web App environment, not in browser code:

| Setting | Purpose |
| --- | --- |
| `ADMIN_EMAILS` | Existing comma-separated admin allowlist. |
| `COSMOS_DB_CONNECTION_STRING` | Connection string for the **MongoDB API**, not a Cosmos NoSQL endpoint. |
| `COSMOS_DB_NAME` | Database name; defaults to `rahultech_prod`. |
| `AZURE_STORAGE_ACCOUNT_URL` | Preferred Blob service URL, such as `https://ACCOUNT.blob.core.windows.net`. Uses managed identity on Azure. |
| `AZURE_STORAGE_CONNECTION_STRING` | Alternative when no account URL is set. |
| `AZURE_STORAGE_CONTAINER` | Upload container; defaults to `uploads`. |
| `AZURE_STORAGE_CDN_URL` | Optional public base URL mapped to the upload container. Leave blank to use the application media route. |
| `AZURE_KEYVAULT_URI` | Optional SDK secret fallback when connection strings are absent. |
| `YOUTUBE_API_KEY` | Server-side YouTube Data API v3 key. Never prefix with `NEXT_PUBLIC_`. |

For managed identity Blob access, grant the Web App identity **Storage Blob Data
Contributor** at the storage account scope (or a pre-created container scope).
If using the Key Vault SDK fallback, grant **Key Vault Secrets User** and provide
secrets named `cosmos-db-connection-string` and `storage-connection-string`.
Network rules/private endpoints must permit the Web App to reach these services.
Restart the app after changing settings. No Azure resources or role assignments
were changed by this implementation.

Collections are `posts`, `adventures`, `projects`, `videos`, `about`, and
`settings`. Existing records retain their IDs. The existing list query sorts on
`publishedAt`, `visitedAt`, and `createdAt`; existing Cosmos Mongo collections
must support that compound sort with a matching index if required by the account.

Without Cosmos configuration, the website shows its existing sample content.
A configured empty database remains empty. The optional **Import existing
content** action copies valid samples into an empty collection; nothing is seeded
automatically. Placeholder YouTube IDs are deliberately excluded. A configured
but unreachable database returns an error instead of pretending a save succeeded.

## YouTube

Enable YouTube Data API v3 in your Google Cloud project and create a server API
key restricted to that API. On `/youtube`, enter a channel URL, `@handle`, or
`UC...` channel ID and select **Connect channel**. Use **Sync playlists** after
adding or renaming playlists. Sync is manual and supports up to 1,000 public
playlists. Each playlist has its own embedded player and YouTube link.

Only channel/playlist metadata is stored in Cosmos (`settings`, ID
`youtube-channel`). Videos remain hosted on YouTube; no account password is
requested or stored. Private playlists require a separate Google OAuth feature
and are not supported by this API-key flow. Playback remains subject to the
video owner's embedding permissions and YouTube availability.

## Verification

```sh
node --test lib/content.test.mjs lib/azure/easy-auth.test.mjs
npm run build
```

Tests cover schema validation, draft filtering, admin-only CRUD, duplicate slugs,
upload signatures, Blob byte ranges, playlist pagination, and existing Easy Auth
authorization. Browser checks use mocked APIs and do not modify Azure data.
After deployment, verify one real create/edit/delete, image upload, MP4 playback,
and channel sync with the production settings before relying on the workflow.