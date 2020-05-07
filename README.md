# SSSF_Deck_Builder_Project

This is my MTG deck builder for a school project

## Description

This is a website that lets you register as a user and create decks consisting of Magic the Gathering cards of your choosing. The decks will be visible in your personal profile page, and you can update the contents of said decks afterwards as new sets are released, or when you just find new combos to add. Website also has a separate card search which currently works by searching cards by their name.

Card searching is done with magithegathering.io API. Frontend of the project is vanilla html and css, with some ejs files to render the decks and profiles. Backend is a mongodb database that works using node.js, GraphQL and some JWT for authentication.

## Things to note

To run this locally, you want to clone the localBranch version, as pBranch version has different urls for jelastic.

When using the card searching functions it is suggested you do not make one letter searches. Magic the Gathering has over 22,000 cards, and single letter searches will try to search every card with the said letter in their name.

### To use

1. run
```
npm install
```
2. make a .env file containing
```
DB_URL= (your mongodb url)
HTTP_PORT=3000
JWT_A_S= (your secret)
```
3. run 
```
npm start
```
