'use strict';

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean,
    GraphQLNonNull,
} = require(
    'graphql');

const bcrypt = require('bcrypt');
const saltRound = 12;

const authController = require('../controllers/authController');
const deck = require('../models/deck');
const card = require('../models/card');
const user = require('../models/user');

//Basic types

const cardType = new GraphQLObjectType({
    name: 'card',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        cmc: {type: GraphQLInt},
        colors: {type: GraphQLList(GraphQLString)},
        types: {type: GraphQLList(GraphQLString)},
        subtypes: {type: GraphQLList(GraphQLString)},
        power: {type: GraphQLString},
        toughness: {type: GraphQLString},
        imageUrl: {type: GraphQLString},
        cid: {type: GraphQLString},
    }),
});

const userType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: {type: GraphQLID},
        username: {type: GraphQLString},
        decks: {
            type: GraphQLList(deckType),
            resolve(parent, args) {
                return deck.find({_id: {$in: parent.decks}});
            },
        },
        token: {type: GraphQLString},
    }),
});

const deckType = new GraphQLObjectType({
    name: 'deck',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        cover: {type: GraphQLString},
        cards: {type: GraphQLList(cardEntry)},
        user: {type: GraphQLString},
    }),
});

//Objects for mutations

const cardEntry = new GraphQLObjectType({
    name: 'cardEntry',
    fields: () => ({
        card: {
            type: cardType,
            resolve(parent, args) {
                return card.findById(parent._id);
            },
        },
        amount: {type: GraphQLInt},
    }),
});


const inputCard = new GraphQLInputObjectType({
    name: 'inputCard',
    description: 'this is where you add or delete cards from the deck',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        cmc: {type: new GraphQLNonNull(GraphQLInt)},
        colors: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        types: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        subtypes: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        power: {type: new GraphQLNonNull(GraphQLString)},
        toughness: {type: new GraphQLNonNull(GraphQLString)},
        imageUrl: {type: new GraphQLNonNull(GraphQLString)},
        cid: {type: new GraphQLNonNull(GraphQLString)},
    }),
});

const modifyCards = new GraphQLInputObjectType({
    name: 'modifyCards',
    description: 'this is where you add or delete cards from the deck',
    fields: () => ({
        card: {type: inputCard},
        amount: {type: GraphQLInt}
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        deck: {
            type: deckType,
            description: 'Get deck by id',
            args: {
                id: {type: GraphQLID}
                },
            resolve(parent, args) {
                return deck.findById(args.id);
            },
        },
        decks: {
            type: new GraphQLList(deckType),
            description: 'Get all decks',
            resolve: (parent, args) => {
                return deck.find();
            },
        },
        card: {
            type: cardType,
            description: 'Get card by id',
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return deck.findById(args.id);
            },
        },
        cards:{
            type: cardType,
            description: 'Get cards',
            resolve(parent, args) {
                return card.find();
            },
        },
        user: {
            type: userType,
            description: 'Get user by token, authentication required.',
            resolve: async (parent, args, {req, res}) => {
                try {
                    const result = await authController.checkAuth(req, res);
                    result.token = 'you have it already';
                    return result;
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        login: {
            type: userType,
            description: 'Login with username and password to receive token.',
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent, args, {req, res}) => {
                console.log('login schema arks', args);
                req.body = args;
                try {
                    const authResponse = await authController.login(req, res);
                    console.log('this is also in schema btw auth response', authResponse);
                    return {
                        id: authResponse.user._id,
                        ...authResponse.user,
                        token: authResponse.token,
                    };
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'MutationType',
    fields: () => ({
        addDeck: {
            type: deckType,
            description: 'Add a deck and see if authentication actually works',
            args: {
                user: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve: async (parent, args, {req, res}) => {
                try {
                    await authController.checkAuth(req, res);
                    let newDeck = new deck({
                        ...args
                    });
                    return newDeck.save();
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        addDeckToUser: {
            type: userType,
            description: 'Run with addDeck to add the deck id to the user',
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                decks: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve: async (parent, args ) => {
                try {
                    const id = await user.findById(args.id);
                    if (!id.decks) {
                        id.decks = [];
                }
                    id.decks.push(args.decks);
                    return await user.findByIdAndUpdate(args.id, id, { new: true });
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        modifyDeck: {
            type: deckType,
            description: 'Modify deck by adding or removing cards, authentication required.',
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                cover: {type: GraphQLString},
                cards: {
                    type: new GraphQLNonNull(new GraphQLList(modifyCards)),
                },
                user: {type: GraphQLID},
            },
            resolve: async (parent, args, {req, res}) => {
                console.log('asdasdasdasadasdasdasdasdasasdadsadsadsadasdasdassadasda');
                try {

                    //await authController.checkAuth(req, res);
                    const thisU = await user.findById(args.user);
                    const thisD = await deck.findById(args.id);
                    //this is here to check that only the user that owns the deck can modify it
                    if(thisU.id === thisD.user) {
                        const cards = await Promise.all(args.cards.map(async card1 => {
                            const str = card1.card.imageUrl.replace('http', 'https');
                            card1.card.imageUrl = str;
                            const result = await card.find({cid: card1.card.cid});
                            if (result[0] === undefined) {
                                let newCard = new card(card1.card);
                                const res = await newCard.save();
                                return {_id: res._id, amount: card1.amount};
                            } else {
                                return {_id: result[0]._id, amount: card1.amount}
                            }
                        }));


                        let modifiedDeck = {
                            name: args.name,
                            cover: args.cover,
                            cards: cards,
                            user: args.user,
                        };
                        const asd =  await deck.findByIdAndUpdate(args.id, modifiedDeck,
                            {new: true});
                        console.log(asd);
                        return asd
                    }
                    else{
                        console.log('Incorrect user/deck id pairing');
                    }
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        deleteDeck: {
            type: deckType,
            description: 'Delete a deck, authentication required.',
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                user: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve: async (parent, args, {req, res}) => {
                try {
                    await authController.checkAuth(req, res);
                    const thisU = await user.findById(args.user);
                    const thisD = await deck.findById(args.id);
                    //this is here to stop users from deleting other users decks
                    if(thisU.id === thisD.user) {
                        const result = await deck.findByIdAndDelete(args.id);
                        console.log('delete result', result);
                        return result;
                    }
                    else{
                        console.log('Incorrect user/deck id pairing');
                    }
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        registerUser: {
            type: userType,
            description: 'Register user.',
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent, args, {req, res}) => {
                try {
                    const hash = await bcrypt.hash(args.password, saltRound);
                    const userWithHash = {
                        ...args,
                        password: hash,
                    };
                    const newUser = new user(userWithHash);
                    const result = await newUser.save();
                    if (result !== null) {
                        req.body = args;
                        const authResponse = await authController.login(req, res);
                        console.log('register user auth response', authResponse);
                        return {
                            id: authResponse.user._id,
                            ...authResponse.user,
                            token: authResponse.token,
                        };
                    } else {
                        throw new Error('insert fail');
                    }
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
    }),
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});