'use strict';

const alfy = require('alfy');

const api = 'https://source.unsplash.com';
const size = alfy.input;
const re = /^([0-9]+x[0-9]+)$/gi;
const isValidSize = size.match(re);

// Check if the size format is valid
if (isValidSize) {
    // Get all the environment variables
    let environmentVariables = Object.keys(process.env)
                                .filter(el => el.includes('query:'))
                                .reduce((obj, key) => {
                                    obj[key.replace('query:', '')] = process.env[key];
                                    return obj;
                                }, {});

    const items = Object.entries(environmentVariables)
                    .map(x => {
                        let key = x[0];
                        let value = x[1];
                        let item = {
                            mods: {}
                        };
                        let endpoint = '';

                        // Check if a value exists
                        if (value) {
                            // Decide how to format the item
                            switch (key) {
                                // User
                                case 'user':
                                    endpoint = `user/${value}/${size}`;
                                    item.title = `Photo by: ${value}`;
                                    item.mods.ctrl = {
                                        subtitle: `press ⏎ to go to ${value}'s page`,
                                        arg: `https://unsplash.com/@${value}`
                                    };
                                    break;

                                // User's Likes
                                case 'user-likes':
                                    endpoint = `user/${value}/likes/${size}`;
                                    item.title = `Photo liked by: ${value}`;
                                    item.mods.ctrl = {
                                        subtitle: `press ⏎ to go to ${value}'s likes page`,
                                        arg: `https://unsplash.com/@${value}/likes`
                                    };
                                    break;

                                // Collection
                                case 'collection':
                                    endpoint = `collection/${value}/${size}`;
                                    item.title = `Photo from Collection ID: ${value}`;
                                    item.mods.ctrl = {
                                        subtitle: `press ⏎ to go to collection page`,
                                        arg: `https://unsplash.com/collections/${value}`
                                    };
                                    break;

                                // Daily
                                case 'daily':
                                    // TODO
                                    break;

                                // Weekly
                                case 'weekly':
                                    // TODO
                                    break;

                                // Search
                                case 'search':
                                    endpoint = `${size}/?${value}`;
                                    item.title = `Photo search for: ${value}`;
                                    item.mods.ctrl = {
                                        subtitle: `press ⏎ to go to search page`,
                                        arg: `https://unsplash.com/search/photos/${value}`
                                    };
                                    break;

                                // Specific Photo
                                case 'photo':
                                    endpoint = `${value}/${size}`;
                                    item.title = `Photo with ID: ${value}`;
                                    item.mods.ctrl = {
                                        subtitle: `press ⏎ to go to photo page`,
                                        arg: `https://unsplash.com/photos/${value}`
                                    };
                                    break;
                            }

                            let url = `${api}/${endpoint}`;
                            item.subtitle = url;
                            item.arg = url;
                            item.quicklookurl = url;
                            item.mods.cmd = {
                                subtitle: 'press ⏎ to open photo in browser',
                                arg: url
                            };

                            return item;
                        } else {
                            return {};
                        }
                    });

    // Random
    let randomUrl = `${api}/random/${size}`;
    items.push({
        title: `Random Photo`,
        subtitle: randomUrl,
        arg: randomUrl,
        quicklookurl: randomUrl,
        mods: {
            cmd: {
                subtitle: 'press ⏎ to open photo in browser',
                arg: randomUrl
            },
            ctrl: {
                subtitle: 'press ⏎ to open photo in browser',
                arg: randomUrl
            }
        }
    });

    alfy.output(items);
} else {
    // Size Error
    alfy.output([{
        title: 'Invalid size format',
        subtitle: 'The size should be in the format: WIDTHxHEIGHT (500x300)',
        icon: {
            path: alfy.icon.error
        }
    }]);
}
