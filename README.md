
# YouTube Clone with some Additional Features

I have made a YouTube clone with channel creation, video upload functionality along with focusing on enhancing the functionality and user experience of a web application by implementing several key features. These features included creating a rich text editor for posting questions, developing a public space page for content sharing with abusive content filtering, enabling users to add custom avatars, and integrating a custom video player with gesture-based controls.

[Visit Now](https://youtube100.netlify.app/)🚀

![Home Page](https://github.com/kunal9oct/Youtube_Clone--MERN/assets/110735646/ce61b42b-3d93-4b75-8bc0-6011214b4d31)

## 🖥️ Tech Stack

**Client:** Nextjs, TailwindCSS, Shadcn, Axios, Framer Motion, lucid-react

**Server:** Node, Express, Socket.io, JWT, Bcryptjs, Cors, Mongoose, MongoDB

## 🚀 Features

- User Authentication (Login and Register)
- Session management with jwt
- Analytical Dashboard for user
- Creation and task assignment by user
- Real time notification syatem (socket)
- Tasks filteration
- Full Responsiveness


## Getting Started

#### Prerequisites
Before running the application, make sure you have the following installed and created:

- [Node.js](https://nodejs.org/en/download)
- [MongoDB Atlas account](https://www.mongodb.com/)

#### Installation

##### 1. Clone the repository

```bash
  git clone https://github.com/kunal9oct/Youtube_Clone--MERN.git
```

##### 2. Go to the project directory and install dependencies for both the client and server

```bash
  cd frontend
  npm install
```

```bash
  cd server
  npm install
```

#### 3. Create a .env file in the server directory and add the environment variables as shown in the Environment Variables section below.

##### 4. Start the server

```bash
  cd server
  node index.mjs
```

##### 5. Start the frontend

```bash
  cd frontend
  npm run dev
```

Done! Now open localhost:3000 in your browser.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```bash
PORT=
JWT_SECRET=
CONNECTION_URI=
```

