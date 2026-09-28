---
name: Demo-mode interview signal
description: The current HireLens experience works without external AI credentials and keeps interview analytics on the client.
---

HireLens demo mode uses the browser's local speech engine for question playback and local storage for answer feedback history and dashboard trend data.

**Why:** The workspace intentionally does not depend on external AI provider credentials, so the product remains usable while authentication, persistent storage, and hosted audio are not configured.

**How to apply:** Preserve the offline flow when making UI changes. If production persistence is added, migrate the stored result shape to authenticated server records without removing the local fallback.