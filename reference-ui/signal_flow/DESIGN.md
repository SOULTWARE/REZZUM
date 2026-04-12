# Design System Specification: The Intelligent Feed

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**

This design system is engineered to transform the chaotic noise of RSS feeds into high-signal social content. Unlike typical "box-heavy" SaaS platforms, this system adopts an editorial, high-end aesthetic that favors **Atmospheric Depth** over rigid containment. 

By prioritizing "Soft Minimalism," we break the traditional grid-template look. We achieve this through **intentional asymmetry**, where content is balanced by generous negative space rather than centered alignment, and **tonal layering**, where the UI feels like a series of sophisticated, physical surfaces stacked in 3D space. The goal is to make the power user (agencies and founders) feel they are working within a calm, premium studio environment.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in high-fidelity neutrals with a singular, authoritative blue (`primary`) to guide the eye.

### The "No-Line" Rule
To achieve a signature premium feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a sidebar using `surface-container-low` should sit directly against a `surface` main content area without a separating stroke.

### Surface Hierarchy & Nesting
Treat the UI as layered sheets of fine paper. 
- **Base Layer:** `surface` (#f7f9fb)
- **Secondary Workspaces:** `surface-container-low` (#f0f4f7)
- **Interactive Cards/Modules:** `surface-container-lowest` (#ffffff) 
- **Pop-overs/Modals:** `surface-bright` (#f7f9fb) with Glassmorphism.

### The "Glass & Gradient" Rule
- **Glassmorphism:** For floating navigation or action bars, use `surface-container-lowest` at 80% opacity with a `24px` backdrop-blur. 
- **Signature Textures:** Main CTAs should use a subtle linear gradient from `primary` (#0053da) to `primary_dim` (#0048c1) at a 145° angle to provide a "jewel-like" depth that flat colors lack.

---

## 3. Typography: Editorial Authority
The system utilizes two distinct sans-serifs to balance technical precision with approachable modernism.

*   **Display & Headlines (Manrope):** Chosen for its geometric purity and wide stance. It communicates stability and "AI-driven" intelligence.
*   **Body & UI (Inter):** The industry standard for readability. Its tall x-height ensures clarity for complex RSS feed data.

### Typography Scale
| Level | Font | Size | Weight | Role |
| :--- | :--- | :--- | :--- | :--- |
| **display-lg** | Manrope | 3.5rem | 700 | Hero marketing statements |
| **headline-md** | Manrope | 1.75rem | 600 | Dashboard section headers |
| **title-lg** | Inter | 1.375rem | 600 | Content card titles |
| **body-md** | Inter | 0.875rem | 400 | Default reading text |
| **label-sm** | Inter | 0.6875rem | 600 | Metadata, timestamps, tags (Uppercase) |

---

## 4. Elevation & Depth: Atmospheric Layering
We move away from the "Stripe-clone" look by using Tonal Layering instead of traditional drop shadows.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a natural "lift" that feels organic rather than artificial.
*   **Ambient Shadows:** For elements that must float (Modals, Tooltips), use a custom multi-layered shadow:
    *   *Shadow:* `0px 12px 32px rgba(42, 52, 57, 0.06)` (Tinted with `on_surface`).
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#a9b4b9) at **15% opacity**. Never use 100% opaque borders.
*   **Roundedness:**
    *   `DEFAULT`: 0.5rem (Standard buttons/inputs)
    *   `lg`: 1rem (Main content cards)
    *   `full`: 9999px (Pills and Status indicators)

---

## 5. Components: Minimalist Primitives

### Buttons
- **Primary:** Gradient (`primary` to `primary_dim`), `on_primary` text, `DEFAULT` roundedness. No border.
- **Secondary:** `surface-container-highest` background with `on_surface` text. Subtle hover state transition to `surface-dim`.
- **Tertiary:** No background. `on_surface_variant` text. Shifts to `on_surface` with a `surface-container-low` ghost background on hover.

### Cards & Feed Items
- **Constraint:** Forbid the use of divider lines.
- **Implementation:** Separate RSS feed items using `24px` of vertical white space. Use a `surface-container-lowest` background for the "Active" or "Selected" item to make it pop from the background.

### Input Fields
- **Styling:** `surface-container-lowest` background. No border, but a `2px` inset shadow on focus using `primary` at 20% opacity.
- **Labels:** Use `label-md` in `on_surface_variant` (Medium Gray), positioned strictly above the field with `8px` spacing.

### Custom Component: The "AI Pulse" Chip
For content being generated or processed by AI, use a chip with a `tertiary_container` background and a subtle `tertiary` pulse animation on the left-hand icon to signify background activity without interrupting the user.

---

## 6. Do’s and Don’ts

### Do
- **Do** use `surface-container-lowest` for the main work area to create a "Sheet of Paper" effect.
- **Do** use asymmetric layouts. If a column of text is on the left, leave the right 1/3 of the container empty to allow the UI to "breathe."
- **Do** use `primary` sparingly. It is a "laser pointer," not a "paint bucket."

### Don’t
- **Don’t** use black (#000000) for text. Always use `on_surface` (#2a3439) to maintain a soft, premium contrast.
- **Don’t** use 1px dividers between list items. Use white space and subtle background shifts (`surface` vs `surface-container-low`).
- **Don’t** use sharp corners. Everything must adhere to the `0.5rem` minimum radius to maintain the "Soft Minimal" aesthetic.
- **Don’t** use standard blue for links. Use `primary` but ensure it is always paired with an intentional interaction state (underline on hover).