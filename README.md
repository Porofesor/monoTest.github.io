# Monopoly with Markov Chain AI

## Link to Demo
https://porofesor.github.io/monoTest.github.io/

Welcome to the Monopoly game simulation project! This repository features an advanced implementation of the classic Monopoly game with an AI powered by Markov Chains for strategic decision-making.

## Features

- **Classic Monopoly Rules**: Enjoy the timeless gameplay of Monopoly.
- **Markov Chain AI**: A state-of-the-art AI that uses Markov Chains to analyze and predict optimal moves.
- **Customizable Game Settings**: Configure game rules, player counts, and difficulty levels.
- **Interactive or Simulation Mode**: Play against the AI or simulate full games.

## How It Works

The AI uses a Markov Chain to model the game's state transitions. By analyzing probabilities of landing on specific spaces and the potential outcomes of various decisions, the AI formulates strategies such as:

- Optimal property purchases
- Trade evaluations
- Decision-making during auctions

### Markov Chain Overview

A Markov Chain is a mathematical model that represents a series of states and the probabilities of transitioning between them. In this implementation:

1. **States**: Board spaces and player-specific conditions (e.g., properties owned, cash on hand).
2. **Transitions**: Moves determined by dice rolls, chance/community chest cards, or player decisions.
3. **Probabilities**: Calculated based on dice outcomes and board layouts to assess landing likelihoods.

This approach allows the AI to anticipate future states and strategize accordingly.

