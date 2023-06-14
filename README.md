# Slot game

# Prerequisites

- Install [Node.js](https://nodejs.org/) version >16.9.1
- Install [Express](http://expressjs.com/) version >4.18.2
- Install [Cors](https://github.com/expressjs/cors#readme) >2.8.5
- Install [pixi.js](http://www.pixijs.com/) >7.2.4
- Install [gsap](https://greensock.com) >3.11.5

# Getting Started

- Install dependencies

```
npm install
```

- Run the project

```
npm start
```

The client is accessible here: Navigate to `http://localhost:1234`.

The server is listening on port 3000, you can use a rest client to test it: `http://localhost:3000/spin`

Both projects will hot reload on any code change.

\*There are no known limitations

\*The key design decisions made for this task was the selection of the PIXI.js library. PIXI.js is a fast, flexible, and popular 2D rendering library that was chosen for its suitability for the task at hand.

# Description

A simple slots 3x3 game, rendered in the fronted with the help of PixiJS library and the backend written in NodeJS is returning the game outcome. The game is written with Typescript. The rules are simple, 2 or more similar symbols in a row are considered a small win, if there are 3 similar symbols in a row, a big win is considered. The backend returns a bonus round, with 10% chance of win, in this case, the game will spin the reels automatically, without awaiting for the user input. All the above situations are providing a nice and clear feedback on the UI to the player.
<br>
