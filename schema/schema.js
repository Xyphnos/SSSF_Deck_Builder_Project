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
            type: new GraphQLList(deckType),
            resolve(parent, args) {
                return deck.find({_id: {$in: parent.decks}});
            },
        },
        token: {type: GraphQLString},
    }),
});

const InputGeoJSONType = new GraphQLInputObjectType({
    name: 'Location',
    description: 'Location as array, longitude first',
    fields: () => ({
        type: {type: GraphQLString, defaultValue: 'Point'},
        coordinates: {type: new GraphQLNonNull(new GraphQLList(GraphQLFloat))},
    }),
});

const deckType = new GraphQLObjectType({
    name: 'deck',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        cover: {type: GraphQLString},
        cards: {
            type: new GraphQLList(cardType),
            resolve(parent, args) {
                return card.find({_id: {$in: parent.cards}});
            },
        },
        user: {type: GraphQLString}
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
            description: 'Get all stations',
            args: {
            },
            resolve: (parent, args) => {
                // console.log(args);
                if (args.bounds) { // if bounds arg is in query
                    // console.log('bounds', args.bounds);
                    const mapBounds = rectangleBounds(args.bounds._northEast,
                        args.bounds._southWest);
                    return station.find(({
                        Location: {
                            $geoWithin: {  // geoWithin is built in mongoose, https://mongoosejs.com/docs/geojson.html
                                $geometry: mapBounds,
                            },
                        },
                    }));
                } else { // if no args or start or limit
                    return station.find().skip(args.start).limit(args.limit);
                }
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

module.exports = new GraphQLSchema({
    query: RootQuery,
});