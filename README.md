# Tournament Bracket Creator

A simple little tool to help with the process of creating a bracket for a tournament.

## How to use

1. Clone the repo
2. Run `npm install` to install the dependencies
3. Run `npm run dev` to start the development server
4. Open the app in your browser at `http://localhost:3000`
5. Use the text area to input the items you want to bracket. One per line.
6. Click the "Match Items" button to create the bracket.
7. Click on the winner of the matchup.
8. Repeat until you have a winner.

## How it works

The app uses a simple single-elimination bracket. The bracket is created by matching up the items in each round. The app keeps track of which items have been matched up so that no item is matched up against itself or any of its descendants.

The app also keeps track of the time you take to make your choice. The simple logic is that longer you take to pick, the closer the two choices must be. This means that closer matchups are scored lower than decisive matchups.

The final score is scaled up so that the top score is 100.

