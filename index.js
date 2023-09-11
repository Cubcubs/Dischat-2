const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const db = new (require("@replit/database"));

let messages = []
// db.set(`bannedUsers`, "[]")

db.set('messages', "[]")
db.set('admins', '["haroon", "bddy", "CosmicBear"]')
db.list().then(keys => {
  if (!keys.includes('admins')) db.set('admins', '["haroon", "bddy", "CosmicBear"]')
  if (!keys.includes('messages')) db.set('messages', "[]")
  if (!keys.includes('bannedUsers')) db.set('bannedUsers', "[]")
  if (!keys.includes('announcement')) db.set('announcement', "welcome to replchat!")  
  return db.get('messages')
}).then(m => {
  messages = JSON.parse(m)
  return db.get('bannedUsers')
}).then(bu => {
  global.BannedUsers = JSON.parse(bu)
  return db.get('announcement')
}).then(a => {
  global.announcement = a
})

require('ejs')
app.use(express.static('static'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', {
		id: req.get('X-Replit-User-Id'),
		name: req.get('X-Replit-User-Name'),
		roles: req.get('X-Replit-User-Roles'),
    announcement: global.announcement || 'welcome to replchat!',
  });
});

// app.get('/home', (req, res) => {
//   res.render('index', {
// 		id: req.get('X-Replit-User-Id'),
// 		name: req.get('X-Replit-User-Name'),
// 		roles: req.get('X-Replit-User-Roles'),
//     announcement: global.announcement || 'welcome to replchat!',
//   });
// })

app.get('/test-game', (req, res) => {
  res.render('games/base-page.ejs', { game: "chrome-dino" })
})

// app.get('/test', (req, res) => {
//   res.render('test', {
// 		id: req.get('X-Replit-User-Id'),
// 		name: req.get('X-Replit-User-Name'),
// 		roles: req.get('X-Replit-User-Roles')
//   });
// });
// app.get('/info', (req, res) => {
//     res.render("info")
// });

io.use((socket, next) => {
  socket.name = socket.request.headers['x-replit-user-name']

  if (socket.name == "") socket.requiresIdentify = true
  next()
})


const {Collection} = require('@discordjs/collection') 

let emotes = [
  {
    a: ':sunglasses:',
    b: '😎'
  },
  {
    a: ':cry:',
    b: '😢'
  },
  {
    a: ':amongus:',
    b:  'ඞ'
  },
  {
    a: ':sob:',
    b: '😭'
  }
]

const filter = new (require('bad-words'))({ placeHolder: '#' })
let filteron = true

let testBans = [
  "replchat123",
  "uurba",
  "replspammer",
  "eDawwg",
  "GamimgAccount1",
  "SUPIeRDIMA",
  "ilkergaming ",
  'kornineq', 'grappa', // alt accounts, perm ban,
  'Cinnamon-Toe-Crunch',
  'NintendoKUI', // spamming hard n word,
  'French-Cat', // literally put people's ips in chat,
  "thelightkidgame", // spamming hard n word,
  "xlk",
  "WilliamBenard",
  
]

io.on('connection', (socket) => {
  if ('requiresIdentify' in socket) {
    // socket.disconnect();
    // return socket.emit('debug', "Bots are currently disabled.")
    socket.emit('debug', "REQUIRES_IDENTIFY")
    socket.on('identify', (username) => {
      socket.name = username
      socket.requiresIdentify = false
      connection(socket)
    })
  } else {
    connection(socket)
  }
});

const { fetch } = require('undici')

const bannedPrefixes = [
  "i love you ",
  "pogger "
]

function dadBot(msg) {
  // let match = msg.match(/(i am|i'm|im) ([^\n]+)/)

  // if (match) {
  //  return  io.emit('chat message',{
  //     message: `Hi ${match[2]}, I'm Dad!`,
  //     pfp: 'https://storage.googleapis.com/replit/images/1650300121717_45e36fe77f9dcb03dfe2819bd2e68b11.jpeg',
  //     username: 'Dad Bot [VERIFIED BOT]' // dad is verified!
  //   })}
  
  

  // if (msg.toLowerCase().includes('dad bot') && msg.toLowerCase.includes('die')) {
  //   return io.emit('chat message', {
  //     message: `no u`,
  //     pfp: 'https://storage.googleapis.com/replit/images/1650300121717_45e36fe77f9dcb03dfe2819bd2e68b11.jpeg',
  //     username: 'Dad Bot [VERIFIED BOT]' // dad is verified!
  //   })
  // }

  // if (msg.toLowerCase().includes('hacker')) {
  //   return io.emit('chat message', {
  //     message: `"![hecker](https://i.imgur.com/27rmVo1.png)"`,
  //     pfp: 'https://storage.googleapis.com/replit/images/1650300121717_45e36fe77f9dcb03dfe2819bd2e68b11.jpeg',
  //     username: 'Dad Bot [VERIFIED BOT]' // dad is verified!
  //   })
  // }

  // if (msg.toLowerCase().startsWith('hey dad say ')) {
  //   let args = msg.toLowerCase().split('hey dad say ')
  //   args.shift();
  //   return io.emit('chat message', {
  //     message: `${args.join('hey dad say ')}`,
  //     pfp: 'https://storage.googleapis.com/replit/images/1650300121717_45e36fe77f9dcb03dfe2819bd2e68b11.jpeg',
  //     username: 'Dad Bot [VERIFIED BOT]' // dad is verified!
  //   })// this bug tester is bypassing swear filter.... remove them okay.
  // } // wtf is going on?
}

// ima make the index.js look prettier

let onlineUsers = []

const bannedUsers = testBans

async function connection(socket) {
  socket.on('typingStart', (usrn) => {
    console.log('tsServer')
    socket.emit('typingStart', (usrn))
  })
  socket.on('typingEnd', (usrn) => {
    console.log('teServer')
    socket.emit('typingEnd', (usrn))
  })
  if(!onlineUsers.includes(socket.name)) {
    onlineUsers.push(socket.name)
    console.log(onlineUsers)
  }
  socket.on('user.ban', async (usr) => {
    let bans = (JSON.parse(await db.get('bannedUsers'))) || []
    bans.push(usr)
    await db.set(`bannedUsers`, JSON.stringify(bans))
    await console.log(bans)
    // how can i push to bannedusers? like push to the array okay so then next,is my code below good?
  })
  let busr = await db.get(`bannedUsers.${socket.name}`)
  if(bannedUsers.includes(socket.name)) {
    socket.disconnect();
    return socket.emit('banned')
  }
  bannedPrefixes.forEach(prefix => {
    if (socket.name.toLowerCase().startsWith(prefix)) {
      socket.disconnect();
      return socket.emit('banned')
    }
  })
  fetch("https://replit.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0",
			"X-Requested-With": "ReplitProfilePictures",
			"Referer": "https://replit.com"
		},
		body: JSON.stringify({
			query: "query userByUsername($username: String!) { user: userByUsername(username: $username) { image } }",
			variables: JSON.stringify({ username: socket.name })
		})
	})
	.then(res => res.json()) 
	.then(data => {
		if (data.data.user) socket.pfp = data.data.user.image 
	})
  socket.on('disconnect', async () => {
    socket.broadcast.emit('left', { username: socket.name })
    if(onlineUsers.includes(socket.name)) {
      let index = onlineUsers.indexOf(socket.name)
      if (index == -1) return;
      onlineUsers.splice(socket.name, 1)
      console.log(onlineUsers)
    }
    // if(await db.get(`onlineUsers.${socket.name}`)) {
    //   await db.remove(`onlineUsers.${socket.name}`)
    //   console.log(db.get(`onlineUsers.${socket.name}`))
    // }
  })
  socket.broadcast.emit('joined', { username: socket.name }) 
  // //if(testBans.includes(socket.name)) return socket.emit('banned')
  socket.on('joinRoom', (room) => {
    socket.join(room)
  })
  let m = await db.get('messages')
  socket.emit('getmessages', JSON.parse(m) || [])
  socket.on('typing', () => {
    socket.broadcast.emit('typing', socket.name)
  })
  socket.on('chat message', (message_obj = { message: '', room: false }) => {
    if (!message_obj) return;
    if (!message_obj.message) return;
    if (typeof message_obj.message != "string") return;
    const { message } = message_obj
    if ((message || "").split(/ +/g).join('') == '') return;
    let newMessage = message
    // let newMessage = message.replaceAll('https://', '').join(newMessage1)
    try {
      if (filteron) newMessage = filter.clean(message)
    } catch (err) {
      console.error(err)
    }

    emotes.forEach((emote) => {
      if (newMessage.includes(emote.a)) {
        newMessage = newMessage.split(emote.a).join(emote.b)
      }
    })

    // fetch(process.env.LOG_WEBHOOK, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     content: newMessage,
    //     avatarURL: socket.pfp,
    //     username: socket.name
    //   })
    // })
    // if (message_obj.room) {
    //   return io.to(message_obj.room).emit('chat message', {username: socket.name, message: newMessage});
    // } else {
    io.emit('chat message', { username: socket.name, message: newMessage, pfp: socket.pfp })
    // }

    // make dad bot prefix dad! the function handles it okay poggers
    // dadBot(newMessage)
    
    messages.push({username: socket.name, message: newMessage, pfp:socket.pfp})
    db.set('messages', JSON.stringify(messages))
  });
  socket.on('admin.refreshall', () => {
    if(!["`bddy`", "DaInfLoop", "CosmicBear"].includes(socket.name)) return;
    io.emit('admin.refreshall', {});
  })
  socket.on('aall', (t) => {
    if(!["bddy", "DaInfLoop", "CosmicBear"].includes(socket.name)) return;
    io.emit('announceAll', t)
  })
  socket.on('admin.clearMessages', () => {
    if(!["bddy", "DaInfLoop", "CosmicBear"].includes(socket.name)) return;
    db.set('messages', "[]");
    messages.length = []
    io.emit('admin.refreshall', {})
  })
  socket.on('admin.filter', () => {
    if(!["bddy", "DaInfLoop", "CosmicBear"].includes(socket.name)) return;
    global.filteron = !global.filteron
  })
  socket.on('admin.announcement', (text) => {
    if(!["bddy", "DaInfLoop", "CosmicBear"].includes(socket.name)) return;
    global.announcement = text
    io.emit('admin.announcement', text)
  })
  socket.on('admin.kick', async (user, ack) => {
    if(!["bddy", "DaInfLoop", "CosmicBear"].includes(socket.name)) return;
    const s = await io.fetchSockets();
    s.forEach(so => {
      if (so.name.toLowerCase() == user) {
        so.emit('admin.kick')
        ack(true)
      }
    })
  })
  socket.on('error', (e = 'No message') => {
    console.log(`${socket.name}'s socket.io instance threw an error:`, e)
  })
}

server.listen(3001, () => {
  console.log('server started');
});


require('axios')("https://replchat.bddy.repl.co")

process.on('unhandledRejection', (err) => {
  console.error(err)
})

