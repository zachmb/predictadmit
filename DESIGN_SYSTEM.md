# GlassCoral Design System
"Submerged Precision" — Forged from liquid glass and polished coral.

## 1. Global Visual Physics (The "Anti-Gravity" Core)
**The Medium**: A deep, caustic void. Not a flat color.
- **Base Gradient**: Linear gradient `#020408` (Abyss) to `#0F1720` (Deep Teal).
- **Texture**: Fixed opacity `0.04` noise pattern (`/noise.svg`) to eliminate banding.
- **Caustics**: Large, slow-moving radial gradients (`#4FD1C5`, `#FF7F50`, `#60A5FA`) blurred at `140px` with `mix-blend-mode: soft-light`.
- **The Float**: Major containers must "breathe" (`translateY ±4px` over 6s, ease-in-out infinite).

## 2. Material System: "Forged Glass"
Do not use standard glassmorphism. Glass needs thickness and weight.
- **Surface**: `bg-white/[0.03]` (3% opacity).
- **Blur**: `backdrop-filter: blur(24px) saturate(160%)`. High saturation is crucial.
- **The Edge (Double-Border)**:
    - Inner Highlight: `box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.15)`
    - Outer Shadow: `box-shadow: 0 4px 24px -1px rgba(0,0,0,0.3)`
    - Border: `border: 1px solid rgba(255,255,255,0.05)`

## 3. Color Palette
- **Abyss**: `#020408` (Background Base)
- **Deep Teal**: `#0F1720` (Background End)
- **Living Coral**: `#FF8C69` (Primary Accent / bioluminescence)
    - Glow Effect: `shadow-[0_0_30px_-5px_rgba(255,140,105,0.4)]`
- **Text Primary**: `text-white/90` or `text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50`.
- **Text Secondary**: `text-white/60`.

## 4. Typography (The "Editorial" Look)
- **Font**: Inter or SF Pro Display.
- **Headings**: `tracking-tight (-0.02em)`, `font-medium`.
- **Body**: `tracking-wide`, `text-white/60`.

## 5. Animation Directives
- **Entrance**: Staggered `fly` (`y: 30`, `duration: 1000ms`, `ease: cubic-out`). opacity `0 -> 1`.
- **Hover**: 
    - Scale: `scale-[1.02]` (using spring physics).
    - Glare: Radial gradient highlight moves across surface.
- **Physics**: Use `svelte/motion` (spring) for interactive elements, not just CSS transitions.

## 6. Component Architecture
### A. The "Dynamic Island" Navbar
- Floating pill, starts `w-auto h-12`, expands to `w-[480px]` on hover.
- Spring physics (`stiffness: 0.12`, `damping: 0.4`).

### B. The Bento Grid
- CSS Grid layout. `gap-6`.
- `rounded-[2rem]` for "liquid" feel.

### C. Charts (DeepfakeChart)
- Glowing lines (`coral-500`).
- Gradient fades under lines.
- Futuristic, holographic look.
