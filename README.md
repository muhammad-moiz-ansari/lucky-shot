# 🏏 Lucky Shot - React Cricket Game

A physics-driven, fully responsive 2D cricket game built entirely with React and modern CSS.  
No `<canvas>`, no heavy game engines—just clever DOM manipulation, custom projectile math, and modular React state management.

## ✨ Features

- **Physics-Based Trajectories:** A custom 20ms physics loop calculates gravity, friction, and bounce vectors for the ball's delivery and return trajectory.
- **Probability Power Bar:** Shot outcomes are determined by stopping a high-speed slider over dynamically generated probability segments.
- **Dynamic Play Styles:** Switch between "Aggressive" and "Defensive" batting styles, which dynamically alter the underlying probability arrays in real-time.
- **Component-Driven Architecture:** The UI is strictly decoupled from the logic engine, utilizing modular React components (`ScoreBoard`, `PowerBar`, `FieldElements`, etc.) and React Refs for collision detection.
- **Fluid Responsive Design:** Uses cutting-edge CSS Container Queries (`cqw`), `clamp()`, and `aspect-ratio` to ensure the stadium, UI, and hitboxes scale flawlessly from mobile screens to 4K monitors without relying on media query breakpoints.
- **Live Commentary Ticker:** A dynamic broadcast system that generates contextual commentary based on the exact outcome of each delivery.

## 🛠️ Tech Stack

- **Frontend Framework:** React (via Vite)
- **Styling:** Pure CSS (Vanilla)
- **Deployment:** Vercel

## ⚙️ Game Logic & Working Mechanism

### 1. The Physics & Collision Engine
The game operates on a continuous loop of physics calculations managed within React's architecture. When a shot is played, a `setInterval` loop calculates the ball's trajectory using standard projectile motion (gravity, time delta, velocity). Collision detection is handled by comparing the pixel coordinates of the ball against the Batter and Wicket using `getBoundingClientRect()`, allowing for dynamic hit/miss detection regardless of screen size.

### 2. The Power Bar (Cumulative Probability)
The Power Bar acts as a visual cumulative distribution function. The game maintains arrays of objects representing shot outcomes and their percentage probabilities. In the UI, these arrays map directly to HTML `<div>` widths. A slider oscillates across this bar; when the player clicks "Play Shot", the current slider integer is checked against the running total of probabilities to determine if the result is a 6, a 4, a dot ball, or a wicket.

### 3. Animation Implementation
The game avoids heavy external animation libraries by using three distinct web-native techniques:
- **State-Driven Animation (The Ball):** The ball's `top` and `right` CSS positions are bound to a React state, updated every 20ms to draw its physical location frame-by-frame.
- **Sprite-Sheet Animation (The Batter):** A classic 2D frame-swapping technique. Upon collision, a rapid interval updates the batter's state from `1.png` sequentially through `8.png`.
- **Hardware-Accelerated CSS (The Wicket):** Breaking the stumps utilizes pure CSS. When the ball hits the wicket coordinates, JavaScript applies a new CSS `transform` (rotation and translation). The browser's graphics processor smoothly interpolates this transition, scattering the stumps.

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muhammad-moiz-ansari/Web-Programming-Tasks/tree/main/Assignment%202%20(Cricket%20Game)
   ```

2. **Navigate into the directory:**
   ```bash
   cd lucky-shot-cricket
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and visit `http://localhost:5173/` (or the port provided in your terminal).**

## 📁 Project Structure

```
├── public/
│   └── assets/              # Sprites, backgrounds, and fonts
├── src/
│   ├── components/          # Modular UI components
│   │   ├── MainMenu.jsx
│   │   ├── GameOverMenu.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScoreBoard.jsx
│   │   ├── PowerBar.jsx
│   │   ├── PlayShotButton.jsx
│   │   └── FieldElements.jsx
│   ├── App.jsx              # Core logic, physics loop, and state management
│   ├── index.css            # Global responsive styles and CSS variables
│   └── main.jsx             # React DOM entry point
└── package.json
```