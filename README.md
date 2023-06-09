# Yugioh Guessing Game

## Project: Yugioh Guessing Game

### Author: [Your Name]

![Yugioh Guessing Game](./YuGiOh%20Guessing%20Game.jpeg)

## Table of Contents

- [Problem Domain](#problem-domain)
- [Links and Resources](#links-and-resources)
- [Collaborators](#collaborators)
- [Setup](#setup)
  - [`.env` Requirements](#env-requirements-where-applicable)
  - [Initializing and Running the Application](#how-to-initializerun-your-application-where-applicable)
  - [Using the Application](#how-to-use-your-application-where-applicable)
- [Features](#features)
- [Tests](#tests)
- [UML Diagram](#uml-diagram)

## Problem Domain

The Yugioh Guessing Game is a multiplayer game where players have to guess the names of various Yugioh cards. The game presents a card image, and the player has to enter their guess for the card name. The game checks if the guess is correct and provides feedback to the player. It aims to test the players' knowledge of Yugioh cards while offering an enjoyable gaming experience.

## Links and Resources

- [Github Repository](http://xyz.com) (when applicable)
- [Demo Video](http://xyz.com) (when applicable)

## File Structure

The project follows the following file structure (**updated**):

├── .github
│ ├── workflows
│ │ └── node.yml
├── driver
│ ├── handler.js
│ ├── index.js
│ └── driver-handler.test.js
├── vendor
│ ├── handler.js
│ ├── index.js
│ └── vendor-handler.test.js
├── .eslintrc.json
├── .gitignore
├── eventPool.js
├── hub.js (**updated**)
├── server.js (**added**)
├── package.json
└── README.md

- `.github/workflows/node.yml`: GitHub Actions workflow configuration for Node.js.
- `driver/handler.js`: Module for managing driver events.
- `driver/index.js`: Entry point for the driver client application.
- `driver/driver-handler.test.js`: Unit tests for the driver event handler.
- `vendor/handler.js`: Module for managing vendor events.
- `vendor/index.js`: Entry point for the vendor client application.
- `vendor/vendor-handler.test.js`: Unit tests for the vendor event handler.
- `.eslintrc.json`: ESLint configuration file.
- `.gitignore`: Specifies intentionally untracked files to ignore.
- `eventPool.js`: Module for the Global Event Pool.
- `hub.js`: Module for managing global package events and communication via Socket.IO (**updated**).
- `server.js`: Server entry point for the CAPS system, implementing Socket.IO (**added**).
- `package.json`: Project configuration file.
- `README.md`: This file.

## Collaborators

- [Your Name]

## Setup

### `.env` Requirements (where applicable)

- No specific environment variables are required at the moment.

### How to Initialize/Run Your Application (where applicable)

1. Clone the repository: `git clone [https://github.com/your-username/yugioh-guessing-game.git]`
2. Navigate to the project directory: `cd yugioh-guessing-game`
3. Install dependencies: `npm install`
4. Start the application: `npm start`

### How to Use Your Application (where applicable)

1. Open the Yugioh Guessing Game application in a web browser.
2. The game will present an image of a Yugioh card.
3. Enter your guess for the card name in the provided text input.
4. Click the "Submit" button to submit your guess.
5. The game will check if your guess is correct and provide feedback.
6. Continue playing by guessing the names of different Yugioh cards.

## Features

- Display: The game displays images of Yugioh cards for the players to guess.
- Input: Players can enter their guesses for the card names.
- Feedback: The game provides feedback to the players, indicating whether their guess is correct or incorrect.

## Tests

- Automated tests can be run using the command: `npm test`
- The tests cover the functionality of the game, including card display, player input, and feedback mechanisms.

## UML Diagram

![Yugioh Guessing Game UML](yugioh-guessing-game-uml.png)

This UML diagram represents the structure and flow of the Yugioh Guessing Game. It illustrates the different components and their interactions, including card display, player input, and feedback handling.
