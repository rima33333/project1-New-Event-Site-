const db= require('../config/database')
const Event = require('../models/Event')



let newEvents= [
    new Event({
        title: 'beach cleaning at muscat',
        description: 'test description vvvvvvvvvvvvvvvvvvvvv',
        location:'Alger',
        date: Date.now(),
        created_at:Date.now()
    }),
    new Event({
        title: 'hi',
        description: ' vvvvvvvvvvvvvvvvvvvvv',
        location:'tunis',
        date: Date.now(),
        created_at:Date.now()
    }),
    new Event({
        title: 'l',
        description: 'vc',
        location:'k',
        date: Date.now(),
        created_at:Date.now()
    }),
    new Event({
        title: 'jbt',
        description: 'h',
        location:'b',
        date: Date.now(),
        created_at:Date.now()
    }),




];

// Using async/await

async function saveEvents() {
    try {
        for(let event of newEvents) {
            await event.save();
        }
        console.log('All events saved successfully.');
    } catch(err) {
        console.error('Error saving events:', err);
    }
}

saveEvents();

/*let  newEvent = new Event({
    title: 'this is event 1',
    description: 'test description',
    location:'Alger',
    date: Date.now()
    
});
newEvent.save()
    .then(() => {
        console.log('record was added');
    })
    .catch(err => {
        console.error(err);
    });*/