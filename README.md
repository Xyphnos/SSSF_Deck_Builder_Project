# SSSF_Deck_Builder_Project

This is my MTG deck builder for a school project

## Description

This is a website that lets you register as a user and create decks consisting of Magic the Gathering cards of your choosing. The decks will be visible in your personal profile page, and you can update the contents of said decks afterwards as new sets are released, or when you just find new combos to add. Website also has a separate card search which currently works by searching cards by their name

## Things to note

To run this locally, you want to clone the localBranch version, as pBranch version has different urls for jelastic.

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
