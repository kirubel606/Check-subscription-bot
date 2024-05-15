# YANGO Telegram Bot

YANGO is a Telegram bot designed to facilitate user engagement and reward distribution within the YANGO community. The bot allows users to participate in competitions, check their subscription status, and receive rewards.

## Features

- **Competition Participation:** Users can join competitions and receive rewards.
- **Payment Status Check:** Users can check the status of their payments.
- **User Detail Management:** Users can provide and update their email, phone number, and bank account details.

## Prerequisites

Before running the bot, ensure you have the following installed:

- Node.js
- SQLite

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/yango-telegram-bot.git
    ```

2. Install dependencies:

    ```bash
    cd yango-telegram-bot
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add your Telegram API token:

    ```plaintext
    API_KEY=your-telegram-api-key
    ```

## Usage

1. Start the bot:

    ```bash
    npm start
    ```

2. Interact with the bot on Telegram:

    - Use the `/start` command to initiate interaction.
    - Use the `/check` command to check your details in the database.
    - Use the `/join` command to join competitions.
    - Use the `/Check Payment status` command to check your payment status.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to [Node.js](https://nodejs.org/) for providing a powerful JavaScript runtime.
- Thanks to [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) for the Telegram Bot API wrapper.
- Thanks to [SQLite](https://www.sqlite.org/) for providing a lightweight and efficient database solution.

## Author

- [Your Name](https://github.com/your-username)

