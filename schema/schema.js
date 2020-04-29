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

const cardType = new GraphQLObjectType({
    name: 'card',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLInt, unique: true},
        cmc: {type: GraphQLString},
        colors: {type: new GraphQLList(GraphQLString)},
        types: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        subtypes: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        power: {type: GraphQLString},
        toughness: {type: GraphQLString},
        imageUrl: {type: GraphQLString, unique: true},
        cid: {type: GraphQLString, unique: true},
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
        cards: {
            type: GraphQLList(cardType),
            resolve(parent, args) {
                return card.find({_id: {$in: parent.cards}});
            },
        },
        user: {type: GraphQLString}
    }),
});

const modifyCards = new GraphQLInputObjectType({
    name: 'modifyCards',
    description: 'this is where you add or delete cards from the deck',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLInt, unique: true},
        cmc: {type: GraphQLString},
        colors: {type: new GraphQLList(GraphQLString)},
        types: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        subtypes: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        power: {type: GraphQLString},
        toughness: {type: GraphQLString},
        imageUrl: {type: GraphQLString, unique: true},
        cid: {type: GraphQLString, unique: true},
    }),
});

const InputDeck = new GraphQLInputObjectType({
    name: 'InputDeck',
    description: 'Connection type, level, current and quantity',
    fields: () => ({
        id: {type: GraphQLID}
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        deck: {
            type: deckType,
            description: 'Get deck by id',
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return deck.findById(args.id);
            },
        },
        decks: {
            type: new GraphQLList(deckType),
            description: 'Get all decks',
            args: {
            },
            resolve: (parent, args) => {
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
                name: {type: new GraphQLNonNull(GraphQLString)},
                user: {type: new GraphQLNonNull(GraphQLString)},
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
                    console.log('asdasdasdasdasdasdasdadsaddasdadasdasdsaddadasdasdasd');
                    console.log('asdasdasdasdasdasdasdadsaddasdadasdasdsaddadasdasdasd');
                    const id = await user.findById(args.id);
                    console.log('asdasdasdasdasdasdasdadsaddasdadasdasdsaddadasdasdasd',id);
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
                    type: new GraphQLList(modifyCards),
                },
                user: {type: GraphQLString},
            },
            resolve: async (parent, args, {req, res}) => {
                try {
                    await authController.checkAuth(req, res);
                    let modifiedDeck = {
                        name: args.name,
                        cover: args.cover,
                        cards: args.cards,
                        user: args.user,
                    };
                    return await deck.findByIdAndUpdate(args.id, modifiedDeck,
                        {new: true});
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
            },
            resolve: async (parent, args, {req, res}) => {
                try {
                    authController.checkAuth(req, res);
                    const result = await deck.findByIdAndDelete(args.id);
                    console.log('delete result', result);
                    return result;
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
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasd')
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