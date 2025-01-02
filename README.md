# My Luy - Personal Expense Tracker

**My Luy** is a personal expense tracker that integrates with Telegram to help you manage your expenses seamlessly.

---

## Features
- Easy-to-use Telegram bot interface for managing your expenses.
- Dockerized setup for quick deployment.
- Currency initialization to support multi-currency expense tracking.

---

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your system.
- A Telegram bot token (create one via [BotFather](https://core.telegram.org/bots#botfather)).

### Steps
1. **Clone the repository**  
   ```bash
   git clone https://github.com/KimangKhenng/my_luy.git
   cd my-luy
   ```
2. **Set up the Telegram bot token**  
   1. Go to BotFather on Telegram and create a bot to get your bot token.
   2. Copy .env.example to .env
   ```bash
    cp .env.example .env
   ```
   3. Replace BOT_TOKEN in the .env file with your Telegram bot token.
   
3. **Start the application with Docker Compose**  
   ```bash
   docker compose up -d
   ```
4. **Initialize the bot menu**  
   ```bash
   docker exec -it my_luy-myluy-1 pnpm run init-bot
   ```
5. **Initialize currencies in the database**  
   ```bash
   docker exec -it my_luy-myluy-1 pnpm run init-currency
   ```

## Docker Compose Guide

### Starting the application

To start the application in the background:
```bash
docker compose up -d
```
### Stopping the application

To stop the application:
```bash
docker compose down
```
### Checking logs
To view logs for the running services:
```bash
docker compose logs -f
```
### Rebuilding services
If you make changes to the code or configurations (package.json), rebuild the services:
```bash
docker compose up --build
```

---
## Additional Notes
- Ensure that your .env file is correctly configured before starting the application.
- You can manage and customize bot commands through the Telegram BotFather interface.
- 
Feel free to submit any issues or feature requests via the Issues section. 😊