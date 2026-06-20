<h1 align="center">PeerFlow</h1>

<p align="center">
<img src="https://img.shields.io/badge/React_JSX-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React JSX"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3"/>


## Live Link

Check the project on: [Here](https://peer-flow-delta.vercel.app/)

Go test It! and share the necessary files.

## What is it?

* PeerFlow is a private and signup-free website where you can share links, and send files of any size directly to other devices on your network using your web browser and chat throughout the user joined in the room.
* It is just a simple peer-to-peer share network website.

## Tech Stack
    
- **Frontend:** React (JSX), Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express
- **Real-Time Connection:** Socket.io (WebSockets)
- **File Transfer:** WebRTC (Peer-to-Peer) with WebSocket chunk fallback


## What it does
- **Direct File Transfer:** Sends files of any size directly from your browser to user's browser privately without needing to upload them to the cloud or create an account.
- **Room Collaboration:** Creates instant spaces where you can chat with online peers in real-time and pin notes or links that everyone in the room can see.

## Project Images

**Home Page**

<img width="1532" height="732" alt="Screenshot 2026-06-20 122717" src="https://github.com/user-attachments/assets/6cfebd6f-6765-40b8-9c80-f2bacc1c4dc8" />

**How To Use**

<img width="877" height="701" alt="Screenshot 2026-06-20 123732" src="https://github.com/user-attachments/assets/1db361bb-463e-4849-bd67-3ae965b83c9a" />

**Active Room**

<img width="1536" height="732" alt="Screenshot 2026-06-20 123851" src="https://github.com/user-attachments/assets/7a597905-c1ed-440f-920c-b48aba840a49" />

**File Sharing**

<img width="1535" height="736" alt="image" src="https://github.com/user-attachments/assets/daf1533e-9b1f-4dbe-bcb0-b7041afeea66" />

## How to Run Locally

### 1. Start the Backend Server
Go to the server folder, install all the packages and dependencies , and start the backend:
```bash
cd server
npm install
npm run dev
```

The backend server will run on http://localhost:5000.

Now go to the client folder install the packages, and start the frontend server:

```bash
cd client
npm install
npm run dev
```
Just Open http://localhost:5173 in your browser to access the website.


## PeerFlow Structure

```
client/
    public/                     logos and icons for the site
    src/
        components/
            Chat.jsx            chat box to text back and forth with friends
            FileTransferPanel.jsx  file sharing layout with progress bars
            HowToUseModal.jsx   the simple guide popup showing how to use the site
            QRJoin.jsx          generates a QR code so friends can join your room instantly
            ResourceHub.jsx     the page to save links and notes for everyone in the room
        context/
            ProfileContext.jsx  saves your avatar and nickname directly on your browser
            SocketContext.jsx   handles joining and leaving server rooms
            ThemeContext.jsx    lets you toggle between light and dark mode
        hooks/
            useFileTransfer.js  the main code that handles sending files between browsers
        pages/
            Dashboard.jsx       the homepage where you choose your profile and rooms
            RoomView.jsx        the main layout you see when you're inside a room
        App.jsx                 sets up website paths and URL joins
        index.css               all the custom styling rules for the pages
    package.json                list of packages used on the frontend
server/
    src/                        tracks active rooms and connected users
    index.js                    starts the backend server and handles connection sockets
    package.json                list of backend packages
```


# License

MIT

# Author 

Built By **Arush Verma**
- Email: [arushv115@gmail.com](mailto:arushv115@gmail.com)
