# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Memory Card Game - a vanilla JavaScript browser-based game where players match pairs of cards. It is one of 5 games in the **SASCO Games collection** being integrated into Victor's school portal platform (eStreet.com.au) for Australian schools.

### SASCO Games Collection Context

This game is part of a coordinated collection of 5 educational games:

1. **MathCrush2** (Unity WebGL) - Educational + Time Earner: Students earn "free time" credits by solving math equations
2. **Wordle** (React/TypeScript) - Educational/Homework: Teachers assign vocabulary and spelling practice
3. **2048** (Vanilla JS) - Free Time Reward: Strategic thinking and number doubling
4. **Kangaroo Hop** (Phaser.js) - Free Time Reward: Platformer with progress tracking
5. **Memory Game** (Vanilla JS) - Free Time Reward: Card matching with educational potential

**Central Planning**: All game coordination and integration notes are at `/Users/danielsamus/sasco-games-portal/`

### Educational Role

**Current**: Free Time Reward game (students play after completing educational tasks)

**Future Potential**: Can become educational with themed card decks:
- Letter matching (phonics/alphabet)
- Number matching (math facts)
- Vocabulary matching (sight words, spelling)
- Science concepts (animals, planets, etc.)

The game already has 7 difficulty levels (3×2 to 8×6 grids), making it suitable for differentiated learning across grade levels.

### Original Attribution

Customized from the Udacity FEND Program template with extensive SASCO branding and features added.

## Core Architecture

### File Structure
- `index.html` - Main game interface with embedded difficulty selector, score panel, and modal
- `js/app.js` - All game logic (558 lines total)
- `css/app.css` - All styling including animations and responsive layouts

### Game State Management (js/app.js)

The game uses global variables for state management:
- `cards` - Array of card DOM elements
- `openedCards` - Temporary array holding currently flipped cards (max 2)
- `moves` - Move counter
- `matchedCard` - Collection of successfully matched cards
- `second`, `minute`, `hour` - Timer state
- `interval` - Timer interval reference

### Key Game Flow

1. **Initialization** (`startGame()` at line 173):
   - Empties `openedCards` array
   - Shuffles cards using Fisher-Yates algorithm
   - Resets moves, stars, and timer
   - Called on page load and restart

2. **Card Click Handling** (event listeners at lines 382-387):
   - Each card has 3 event listeners: `displayCard`, `cardOpen`, `congratulations`
   - `displayCard()` (line 207): Toggles CSS classes and plays flip sound
   - `cardOpen()` (line 216): Manages card matching logic
   - When 2 cards open: calls `matched()` or `unmatched()`

3. **Match Logic**:
   - `matched()` (line 231): Adds "match" class, plays sound, shows message, clears `openedCards`
   - `unmatched()` (line 246): Adds "unmatched" class, disables all cards, waits 1.1s, then removes classes and re-enables
   - Matching is based on `type` attribute comparison

4. **Win Condition** (`congratulations()` at line 334):
   - Checks if `matchedCard.length == cards.length`
   - Triggers confetti, sounds, high score saving, and modal display
   - **Important**: This check is dynamic based on current difficulty

### Difficulty System (lines 481-557)

`changeDifficulty()` dynamically regenerates the entire card grid:
- Parses grid size from format "COLSxROWS" (e.g., "4x4")
- Clears deck HTML
- Generates card pairs from 24 available icon types
- Shuffles and creates new DOM elements
- Re-attaches all event listeners
- Updates CSS grid layout dynamically
- Calls `startGame()` to reset game state

Grid sizes: Easy (3x2), Medium (4x3), Normal (4x4), Hard (5x4), Very Hard (6x4), Expert (6x6), Impossible (8x6)

### Audio System (lines 1-73, 390-447)

Two separate Web Audio API contexts:
- `audioContext` - For sound effects (flip, match, wrong, win)
- `musicContext` - For background music loop
- All sounds generated using oscillators (no audio files)

### High Scores (lines 449-479)

Uses localStorage to persist:
- `bestTime` - String format "X mins Y secs"
- `bestMoves` - Integer
- `bestTimeSeconds` - Integer for comparison
- Saved on win via `saveHighScore()`
- Loaded on page load via `loadHighScores()`

### Special Features

1. **Messages System** (lines 75-114): Shows encouraging messages at TOP of screen using fixed positioning
2. **Confetti** (lines 46-73): Uses canvas-confetti library (loaded from CDN)
3. **Star Rating** (lines 296-310): Decreases stars based on move count (>8 moves = 2 stars, >13 moves = 1 star)

## Development Notes

### Working with Cards

When modifying card behavior, remember:
- Cards use `type` attribute for matching (not icon class)
- Always maintain the disable/enable pattern to prevent double-clicks during animations
- `openedCards` array MUST be cleared after each pair attempt
- The 1.1s timeout in `unmatched()` must align with CSS animation duration

### Modifying Difficulty

To add/change difficulty levels:
1. Update the `<select>` in `index.html` (lines 23-31)
2. Grid size is automatically handled by `changeDifficulty()`
3. Ensure total cards is even (pairs required)
4. Icon types array has 24 icons available (line 501-503)

### CSS Animations

Three main animations (lines 410-478):
- `flipInY` - Card flip reveal
- `rubberBand` - Match celebration
- `pulse` - Wrong match shake

### Timer Behavior

Timer starts on first move (`moves == 1` check at line 289) and runs until win or restart.

## Common Issues

1. **Cards not regenerating properly on difficulty change**: The `window.addEventListener('load')` at line 485 ensures cards regenerate with a 100ms delay to allow DOM readiness.

2. **Event listeners duplicating**: `changeDifficulty()` clears the deck HTML completely before regenerating, preventing duplicate listeners.

3. **openedCards not clearing**: Fixed in recent commits - now explicitly cleared in `startGame()` and after match/unmatch.

## Testing the Game

Since this is a vanilla JS project with no build system:
1. Open `index.html` directly in a browser
2. Use browser DevTools console to inspect game state
3. Test different difficulty levels
4. Verify localStorage persistence across page refreshes
5. Test on mobile viewports (responsive breakpoint at 768px)

## Browser Compatibility

- Requires Web Audio API support (all modern browsers)
- Uses CSS Grid (IE11+ not supported without fallbacks)
- localStorage API required for high scores
- External dependencies loaded from CDN:
  - Font Awesome 4.6.1
  - Google Fonts (Coda, Gloria Hallelujah, Permanent Marker)
  - canvas-confetti 1.6.0

## School Portal Integration

### Current Status

**Phase**: Pre-Integration (pending deployment)

The Memory Game follows the same integration pattern as the other SASCO Games:

**Phase 1 - Basic Launch** (Planned):
- Deploy to GitHub Pages at https://dannyboy166.github.io/memory-game/
- Read URL parameters: `?studentId=X&sessionId=Y&token=Z`
- Add "Return to Portal" button that calls: `window.parent.postMessage({ action: 'closeGame' }, '*')`
- Test iframe embedding in Victor's portal

**Phase 2 - Progress Tracking** (Future):
- Optional JS Interop to Victor's API (similar to MathCrush2 pattern)
- Track metrics: best time, best moves, difficulty level played, games completed
- Store in Victor's database alongside other SASCO Games data

**Phase 3 - Advanced Features** (Future):
- Teacher-configurable themed card decks for educational mode
- Assignment system (teachers assign specific difficulty levels)
- Analytics dashboard for teacher insights
- Multi-device sync via portal

### Integration Pattern (Consistent Across All SASCO Games)

All 5 games use the same portal integration approach:

1. **URL Parameters**: Game receives studentId, sessionId, token from portal
2. **Iframe Embedding**: Game runs seamlessly inside portal iframe
3. **Return Navigation**: postMessage API to close game and return to portal
4. **Progress Tracking**: Optional API calls to Victor's backend
5. **Offline-First**: Game works without internet after first load

### SASCO Branding Elements

Consistent across all games:
- **Footer**: "Part of the SASCO Games collection for schools" (index.html:134)
- **Color Palette**:
  - Green: #22c55e (matches, buttons)
  - Blue: #7ab9f1 (backgrounds, timer)
  - Pink: #e56bbf (card backs)
  - Yellow: #f4ef7d (header, stars)
  - Cyan: #a7f0f5 (page background)
- **School-focused messaging**: Educational value emphasized
- **Attribution**: Original Udacity template properly credited (index.html:135)

### Deployment Checklist

Before deploying to GitHub Pages:
- [ ] Create GitHub repository: `memory-game`
- [ ] Enable GitHub Pages in repository settings
- [ ] Test live URL: https://dannyboy166.github.io/memory-game/
- [ ] Verify all CDN dependencies load correctly
- [ ] Test on mobile devices (responsive at 768px breakpoint)
- [ ] Confirm SASCO footer and branding are visible
- [ ] Test iframe embedding with URL parameters
- [ ] Add to central games list at `/Users/danielsamus/sasco-games-portal/`

### Contact & Coordination

- **Portal Developer**: Victor (eStreet.com.au)
- **Educational Advisor**: Mum (teacher input on themed cards and difficulty)
- **Integration Timeline**: Awaiting Mum's approval before Victor integration begins
- **Philosophy**: "Small steps" - get basic launch working first, add features incrementally

### Educational Potential

The Memory Game is uniquely positioned to be **both** a free time reward AND an educational tool:

**As Free Time Reward**:
- Students play with random icon cards
- Develops memory, concentration, pattern recognition
- High scores tracked in localStorage
- 7 difficulty levels for progressive challenge

**As Educational Tool** (Future):
- Teachers configure themed card decks (letters, numbers, vocabulary)
- Assign specific difficulty levels as homework
- Track completion and performance metrics
- Align with curriculum standards (phonics, math facts, etc.)

This dual-purpose capability makes Memory Game a versatile addition to the SASCO Games collection.
