# LeadFlow

### WhatsApp-Style Lead Automation Platform

LeadFlow is a full-stack lead management and automation platform designed to help businesses manage customer inquiries, conversations, leads, and repetitive response workflows from one place.

> **Customer Message → Automation Rule → Lead Update → Automated Response → Conversation History**

## Features

- 📥 Conversation Inbox
- 👥 Lead Management
- ⚡ Rule-Based Message Automation
- 💬 Automated Predefined Responses
- 🏷️ Lead Tags and Status Management
- 🔄 Automatic Lead Creation and Updates
- 📊 Analytics Dashboard
- ⚙️ Persistent Workspace Settings
- 🔎 Lead and Conversation Search
- 🧪 Simulated Customer Messages for testing automation

## How It Works

1. A customer message is received through the simulated inbox.
2. LeadFlow checks the message against active automation rules.
3. Matching keywords determine the configured automation response.
4. The related lead is created or updated.
5. Tags and lead status are applied according to the rule.
6. A predefined business response is added to the conversation.
7. The conversation history is stored in MongoDB.

## Example Automation Rule

**Trigger Keywords**

```text
website, web development, website development
```

**Automated Response**

```text
Thanks for your interest! Please share your website requirements with us, and our team will get back to you shortly.
```

**Lead Tag**

```text
web-development
```

**Lead Status**

```text
Interested
```

Another example can be a pricing rule using:

```text
price, pricing, cost, charges
```

## Tech Stack

- Next.js
- React
- TypeScript
- MongoDB
- Mongoose
- Tailwind CSS
- REST APIs
- Lucide React

## Project Structure

```text
leadflow/
├── app/
│   ├── api/
│   │   ├── automation/
│   │   ├── conversations/
│   │   ├── leads/
│   │   ├── messages/
│   │   └── settings/
│   ├── analytics/
│   ├── automation/
│   ├── inbox/
│   ├── leads/
│   └── settings/
├── components/
├── lib/
├── models/
├── public/
├── .env.local
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HanainCoder/LeadFlow.git
cd LeadFlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env.local` to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Database

LeadFlow uses MongoDB with Mongoose for persistent data storage.

The application stores information such as:

- Leads
- Conversations
- Messages
- Automation Rules
- Workspace Settings

## Automation Testing

The MVP includes simulated incoming customer messages so automation workflows can be tested without requiring a real WhatsApp Business API connection.

For example:

```text
Customer:
"What is your website development price?"
```

LeadFlow can detect the configured pricing keywords and process the message according to the active pricing automation rule.

## Deployment

The application can be deployed using platforms that support Next.js applications, such as Vercel.

Environment variables must be configured in the deployment platform before using the production application.

## Future Improvements

- Real WhatsApp Business API integration
- Follow-up scheduling
- More advanced automation conditions
- Additional communication channels
- Team/workspace features
- Expanded analytics

## Project Status

LeadFlow is an MVP/full-stack project focused on demonstrating lead management, automation workflows, REST API development, database integration, and product-oriented UI development.

## Author

**Muhammad Hanain**

GitHub: https://github.com/HanainCoder

LinkedIn: https://www.linkedin.com/in/muhammad-hanain-31a538270/
