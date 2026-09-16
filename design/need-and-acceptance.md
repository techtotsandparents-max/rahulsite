# RahulSite — need and acceptance

**Desired outcome:** a distinctive, accessible personal digital world where real
authored technology, travel, video and project content can be discovered and the
owner can safely publish updates without editing source code.

**Baseline:** 16 September 2026 · **Status:** requirements, not a passed test report.
All rows start **Not verified**. The owner/QA must record test date, commit, environment,
test or artifact, result and reviewer before changing a row to Passed. Optional rows
may be Deferred only with owner approval and truthful unavailable/hidden UI.
Release requires every core row to pass. One failed sub-condition fails the row.
Implementation decisions and current gaps: [LLD](LLD.md).

## 1. Front end

**Need:** visitors can discover real content quickly on any supported device; owner
publication becomes visible on the public site; playful features never obstruct reading.

| ID | Scope | Acceptance / observable end result | Verification evidence | Status |
|---|---|---|---|---|
| FE-01 | Core | Home, Blog, Travel, YouTube, Projects, About and Contact load by direct URL and navigation; navbar offers one “Let’s Grab a Coffee” link only when a real URL is configured; no broken/placeholder external links | Route smoke tests; keyboard navigation; configured-link audit | Not verified |
| FE-02 | Core | Given an admin publishes a record, its list, detail and relevant home/RSS entries show the committed content within 60s; unpublishing removes it; no production fixture substitution | Real create → draft → publish → read → unpublish E2E with independent public session | Not verified |
| FE-03 | Core | Unknown slugs return 404; drafts remain unavailable publicly; empty collections show an honest empty state; DB failure produces a clear retryable unavailable state, not fabricated success | Unknown/draft URLs, empty DB and dependency-failure tests | Not verified |
| FE-04 | Core | Blog renders sanitized authored body, taxonomy, TOC, estimated reading time, usable code-copy, related content, canonical/OG metadata, RSS and sitemap; search returns only matching published records | Authored fixture with headings/code; search and feed assertions; metadata/print checks | Not verified |
| FE-05 | Core | Travel supports verified destination/date/note, gallery captions, previous/next and keyboard equivalents for swipe, optional approximate map with text fallback; videos load embeds only on action; projects show only supplied links/outcomes | Desktop/mobile gallery tests; network capture before embed interaction; content review | Not verified |
| FE-06 | Core | My Little World opens closed-by-default controls; density 0–1, size 0.5–2, valid weather/style/mode/toggles visibly change scene; Reset restores defaults; Surprise Me never generates invalid state; versioned local preferences survive reload and recover corrupt storage | Store tests plus browser interaction and storage-corruption tests | Not verified |
| FE-07 | Core | Text, navigation and authored content remain available without WebGL; key reading paths work with JS disabled; lazy scene/embeds do not block initial rendering | WebGL failure, JS-disabled and slow-network browser checks | Not verified |
| FE-08 | Optional | AI/newsletter/sync features are hidden or clearly unavailable until configured; enabled AI cites published sources and labels general advice; newsletter reports real delivery/duplicate/failure states | Disabled-state test always required; provider integration tests before enabling | Not verified |
| FE-09 | Core | Production-build lab median of 3 mobile runs meets LCP ≤2.5s and CLS ≤0.02; initial JS ≤250 KiB gzip excluding deferred scene/embeds and hero poster ≤300 KiB, or owner-approved measured exception; field p75 LCP ≤2.5s/INP ≤200ms/CLS ≤0.1 tracked when traffic is sufficient | Report hardware/browser/throttling, bundle data and real-user window; never equate lab with field | Not verified |

## 2. UI

**Need:** an original, polished navy/purple/orange visual world, not a generic
dashboard, with clear hierarchy, approved avatar artwork and inclusive interactions.

| ID | Scope | Acceptance / observable end result | Verification evidence | Status |
|---|---|---|---|---|
| UI-01 | Core | Hero displays “Build. Explore. Share.” and supporting sentence, with Read Blog/Watch Videos actions; home section order follows LLD; typography/color/spacing use semantic tokens; only one coffee CTA | Owner-approved home screenshots and token inspection | Not verified |
| UI-02 | Core | At 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080: no horizontal page overflow, unreadable labels, obstructed controls or avatar head/hand cropping; reflows at 320 CSS px and 200% zoom | Eight viewport captures plus zoom/reflow review | Not verified |
| UI-03 | Core | WCAG 2.2 AA checks: landmarks/skip link/headings/names; keyboard-only completion; visible focus; normal text contrast ≥4.5:1 and large text/essential non-text ≥3:1; no serious/critical automated findings | Automated scan, manual keyboard and screen-reader review; Lighthouse accessibility ≥95 is supporting evidence only | Not verified |
| UI-04 | Core | Drawers and lightboxes announce role/state, trap focus only when modal, close on Escape/outside click and restore trigger focus; mobile controls target ≥44×44 CSS px; visible equivalents for gesture actions | Keyboard, touch and focus-order tests | Not verified |
| UI-05 | Core | Reduced motion stops parallax, plane/bird loops, rain particles and nonessential avatar motion; hidden-tab/offscreen animation pauses; no flashing/autoplay audio/scroll hijacking | OS motion setting and visibility tests; browser performance capture | Not verified |
| UI-06 | Core / optional animated tier | Core: approved consistent static avatar/poster with valid asset paths and fallback, footer composition distinct from hero, no CLS. Optional tier: all 13 LLD states transition without clipping or overlapping clips using approved rigged assets | Asset/provenance review and screenshot set; state/rapid-switch tests for animated tier; PNG pose swaps do not pass the rigged tier | Not verified |
| UI-07 | Core | Every form/list/upload has designed loading, empty, success, error, disabled and validation states; destructive actions confirm intent; biography/media/metrics have supplied provenance; no unlicensed or watermarked preview used as final artwork | State screenshot matrix, copy audit and owner asset approval; verify licensing for supplied sun reference | Not verified |

## 3. Backend

**Need:** a secure CMS with durable Cosmos content, reliable Blob media, real admin
authorization and reproducible delivery, with no secrets exposed or false success states.

| ID | Scope | Acceptance / observable end result | Verification evidence | Status |
|---|---|---|---|---|
| BE-01 | Core | Configured SSO provider signs in allowlisted admin; absent provider isn't advertised; direct mutation without session returns 401, authenticated disallowed user is denied (target 403); each handler checks authorization; cross-origin mutations rejected | Real provider callback/session test plus direct API and CSRF negative tests; allowlist removal test | Not verified |
| BE-02 | Core | Every type has runtime schema validation; invalid JSON/type/fields/URL/operator rejected without DB write; server owns immutable id/createdAt and updatedAt; coordinated clients support target response envelope; stale revisions return 409 | Contract tests for blogs/adventures/projects/videos/settings and negative payload corpus | Not verified |
| BE-03 | Core | Create/read/update/delete persists across restart; all admin screens call correct item endpoints; id/slug uniqueness and bounded pagination enforced; drafts never appear publicly; DB outage yields sanitized explicit error, not fixture 200; recovery works after failed initial connection | Isolated Cosmos integration, duplicate/concurrent-edit/outage/recovery tests | Not verified |
| BE-04 | Core | Upload valid JPG/JPEG/PNG/WebP up to 20 MiB and MP4 up to 100 MiB; oversized, spoofed MIME/signature, invalid extension and unsafe names fail before storage write; bounded-memory handling and clear progress/error states | Boundary sizes (limit and limit+1), malicious file cases, storage object verification | Not verified |
| BE-05 | Core | Uploaded media has durable metadata; public delivery resolves only published asset IDs; drafts restricted to admin preview; returned media actually loads despite private container; failed publish does not report success and leaves recoverable/cleanable unlinked media | Upload → publish → anonymous image/video read; draft access denial; DB-after-upload failure and cleanup tests | Not verified |
| BE-06 | Core | No PAT/keys/passwords in tracked files, browser bundles, artifacts or logs; private credentials entered only outside chat; exposed tokens revoked; sanitized errors and safe Markdown/CSP prevent stored XSS; bounded request/rate limits return 429 | Secret scan, artifact review, XSS/abuse tests and header inspection | Not verified |
| BE-07 | Core | TLS validated for app/data access; encryption and network posture verified rather than inferred; key-rotation procedure identifies inactive key, switches consumers before invalidating old key and proves service continuity | Read-only config evidence plus approved rotation rehearsal; no unsupported claims of VNet/CMK automation | Not verified |
| BE-08 | Core | CI installs deterministically, runs real typecheck/lint/unit/integration/build gates, rejects missing/skipped test setup, produces a secret-free runnable artifact; GitHub OIDC deploys intended commit to intended App Service and smoke checks pass | Successful workflow logs, artifact inspection, deployed commit/health proof and rollback rehearsal | Not verified |
| BE-09 | Core | Request-correlated redacted errors, dependency readiness checks and actionable alerts exist; backup retention verified and isolated restore succeeds; owner approves recovery targets (proposed RPO 24h/RTO 4h) | Failure injection, alert receipt, dated backup/restore and rollback evidence | Not verified |
| BE-10 | Optional | Enabled AI has published-only retrieval/citations, no invented personal facts, injection defenses, limits/reset and no sensitive prompt logging; newsletter has consent, validation, duplicate safety and unsubscribe; sync/schedules operate only with real configured jobs | Feature-specific integration/security tests and owner approval; otherwise Deferred with truthful UI | Not verified |

**Sign-off record:** for each ID attach commit, test environment, date, expected vs
observed result, evidence link and reviewer. Any scope/budget exception must state
reason, risk, owner and revisit date. Documentation or a successful build alone
does not satisfy persistence, accessibility, security or deployment criteria.