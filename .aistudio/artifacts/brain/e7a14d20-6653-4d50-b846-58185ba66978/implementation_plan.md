# alxx.studies - Aesthetic Web Portal & Study Suite

A faithful, full-featured clone of the aesthetic Boba web portal rebranded as **alxx.studies**, featuring rich study tools, game library, media/streaming center, ambient audio player, live server-side Gemini AI study assistant, full account management with an Admin Console for `alxx3433@gmail.com`, moderation/ban tools, game management, and stealth framing tools.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> The implementation plan has been revised to incorporate your explicit administrative and tool requirements:

- **Confirmed Admin Account**: Built-in Admin recognition for **alxx3433@gmail.com** (as well as customizable admin keys/passwords), granting exclusive access to the **Admin Control Deck**.
- **Confirmed Account Creation System**: Full authentication system supporting registration, login, profile customisation, avatar picker, study streaks, and saved preferences.
- **Confirmed Ban & Moderation Suite**: Admin tools to inspect registered accounts, ban/unban abusive users, view user activity, and revoke user access with immediate enforcement.
- **Confirmed Game Addition & Management Tools**: Dedicated admin panel to add new web games directly through the UI (title, category, thumbnail, iframe embed URL, description, tags, custom aspect ratio) with live preview and catalog management.
- **Confirmed Advanced Framing & Cloak Tools**:
  - *Universal Iframe Framer*: In-app web viewport to embed any study tool, proxy link, or game with toolbar controls (back, reload, pop-out, inspect, fullscreen).
  - *`about:blank` Cloaker*: Spawns any game, streaming link, or tool in an unlogged `about:blank` browser tab with disguised title and icon to evade browser history tracking.
  - *Blob URL Framing*: Masks URLs using client-side Blob objects for stealth embedding.
  - *Tab Disguise Engine*: 1-click camouflage presets (Google Classroom, Canvas, Google Drive, Google Docs, Desmos, Edpuzzle) plus custom title and favicon overrides.
  - *Panic Hotkey*: Instant emergency redirect to school or safe portals (default `]`).
- **Confirmed Gemini AI Integration**: Server-side proxy with `@google/genai` (`gemini-3.8-flash`) for live homework and study answers.

***

## 1. Overview & Core Concept

- **What It Does**: alxx.studies is a high-grade aesthetic student workstation and entertainment portal. It integrates live AI homework solving, ambient focus beats, a curated games lounge, streaming media discovery, full user accounts, and dedicated admin controls (banning users, injecting new games, and managing site settings).
- **Target Audience & Roles**:
  - *Admin (`alxx3433@gmail.com`)*: Full site governance, user banning, game injection, framing configuration, and theme management.
  - *Students / Members*: Personal profile, custom study dashboard, saved bookmarks, study streaks, and access to all games, media, and Gemini AI.
  - *Guests*: Seamless access with instant guest sessions.

***

## 2. User Experience & Visual Design

### Key User Flows

1. **Intro & Splash Entrance**:
   - Signature Boba cup animation with interactive tapioca pearl physics, transitioning smoothly into alxx.studies.
2. **Account Creation & Admin Access**:
   - Modal sheet for Sign Up / Log In.
   - When logged in as `alxx3433@gmail.com` (or using the admin passphrase), an **Admin Shield badge** unlocks in the top bar / dock, granting access to the **Admin Control Deck**.
3. **Admin Control Deck**:
   - **User Management Tab**: Table of all registered users with username, email, join date, status (Active/Banned), and 1-click Ban/Unban buttons.
   - **Game Management Tab**: Form to publish new games (Name, Category, Embed URL, Thumbnail URL, Tags, Fullscreen options). Instantly updates the Play library.
   - **Framing & Stealth Tools Tab**: Quick URL frame tester, about:blank launcher test, and emergency redirect URL manager.
4. **Framing & Stealth Tools**:
   - Accessible from Home, Play, and Settings:
     - **Iframe Framer**: Embedded runner with navigation controls (refresh, pop-out, full screen, disguise toggle).
     - **`about:blank` Launcher**: Generates an isolated tab with injected iframe that hides browser history.
     - **Tab Cloak**: Replaces document title and favicon dynamically.
5. **Ask (AI Study Assistant)**:
   - Homework problem solver powered by Gemini (`gemini-3.8-flash`). Supports multi-turn reasoning, markdown math, and step-by-step solutions.
6. **Listen & Play**:
   - Lo-fi tracks and multi-track ambient mixer (rain, cafe, fireplace) with persistent dockable mini-player.
   - Rich library of curated HTML5/web games plus admin-added games.
7. **Expanded Settings**:
   - 12+ Themes (Boba, Matcha, Strawberry, Taro, Mango, Sky, Midnight, Dark Academia, Sakura, Lavender, Dark, Light)
   - Custom Accent Hex Color Picker
   - Disguise selector, Panic Key, and sound FX toggles.

***

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Architecture with Express Backend**
  - *Chosen Approach*: Node.js Express backend (`server.ts`) hosting API routes:
    - `/api/auth`: Register, login, verify session, admin role assignment for `alxx3433@gmail.com`.
    - `/api/admin/users`: List users, toggle ban status, inspect accounts.
    - `/api/admin/games`: Create, update, and delete custom games.
    - `/api/ask`: Server-side proxy to `@google/genai` with `process.env.GEMINI_API_KEY`.
    - `/*`: Vite SPA client static delivery.
  - *Why*: Secure handling of passwords, bans, admin authority, custom game additions, and API keys without leaking anything to the client.
- **Decision 2: Resilient Local + Server Sync for Accounts & Games**
  - *Chosen Approach*: Server maintains users and games in persistent backend storage; client caches data in `localStorage` for instant zero-latency rendering.
  - *Why*: Immediate UI feedback while keeping persistent records across sessions.

***

## 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        alxx.studies Frontend                           │
│                                                                        │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Cup Splash  │  │  Dock & Nav   │  │ Theme Engine │  │ Tab Cloak  │ │
│  │  Animation   │  │  (6 Views)    │  │ (12+ Palettes│  │ & Panic Key│ │
│  └──────┬───────┘  └───────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                  │                 │                │        │
│         ▼                  ▼                 ▼                ▼        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Active View Container                        │  │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ ┌────┐│  │
│  │ │  Home   │ │  Watch  │ │ Listen  │ │  Play   │ │  Ask   │ │Adm ││  │
│  │ │ (Clock, │ │ (TMDb,  │ │ (Lo-fi, │ │ (Games  │ │(Gemini │ │Deck││  │
│  │ │  Favs)  │ │ Stream) │ │ Ambient)│ │ Lounge) │ │ Study) │ │    ││  │
│  │ └────┬────┘ └─────────┘ └────┬────┘ └────┬────┘ └────┬───┘ └─┬──┘│  │
│  └──────┼───────────────────────┼───────────┼───────────┼───────┼───┘  │
│         │                       │           │           │       │      │
│         ▼                       ▼           ▼           │       │      │
│   ┌───────────┐         ┌───────────────┐ ┌───────────┐ │       │      │
│   │  Framing  │         │ Floating Mini │ │  Iframe / │ │       │      │
│   │   Tools   │         │    Player     │ │about:blank│ │       │      │
│   └───────────┘         └───────────────┘ └───────────┘ │       │      │
└─────────────────────────────────┬───────────────────────┼───────┼──────┘
                                  │ Client Fetch Calls    │       │
                                  ▼                       ▼       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Full-Stack Server                         │
│                                                                        │
│   POST /api/auth/register, /api/auth/login  (Admin: alxx3433@gmail.com)│
│   GET/POST /api/admin/users, /api/admin/ban (User Moderation & Bans)   │
│   GET/POST /api/admin/games                 (Custom Game Injection)    │
│   POST /api/ask                             (Gemini 3.8 Flash Proxy)   │
│   GET  /*                                   (Vite SPA Static Build)    │
└────────────────────────────────────────────────────────────────────────┘
```

***

## 5. Verification & Quality Plan

- **Compilation**: Verify build with `compile_applet`.
- **Admin Verification**: Test registering as `alxx3433@gmail.com` and verify that the Admin Shield and Control Deck are unlocked.
- **Ban Tools Verification**: Test banning a secondary user account and verify that login/access is immediately restricted with a clear ban notice.
- **Game Management Verification**: Add a new web game via the Admin Form and verify it appears with thumbnail, title, and plays inside the Play library modal.
- **Framing Tools Verification**: Test the `about:blank` cloaker, the universal iframe framer, and tab disguise triggers.
- **Study AI Verification**: Test Ask AI with math and conceptual homework queries to ensure rich markdown formatting and live Gemini responses.
