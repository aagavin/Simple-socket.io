const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

const PORT = 3000;
const auctionConfig = {};

app.get('/', (req, res) => {
  res.send('<a href="/auction">Auction</a><br /><a href="/bidder">Bidder</a><br />')
});

app.get('/style.css', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(fs.readFileSync(__dirname + '/style.css'));
  res.end();
});

app.get('/auction', (req, res) => res.sendFile(__dirname + '/auction.html'));

app.get('/bidder', (req, res) => res.sendFile(__dirname + '/bidder.html'));

io.on('connection', socket => {

  socket.on('biddingStarted', msg => {
    io.emit('biddingStarted', msg);
    auctionConfig.higest = msg.price;
  });


  socket.on('time', sec => io.emit('time', sec));
  socket.on('done', d => io.emit('done', d));

  socket.on('newBid', msg => {
    

    if (parseInt(msg.bid) > parseInt(auctionConfig.higest)) {
      io.emit('newBid', msg);
      auctionConfig.higest = msg.bid;
    }
  });
});

http.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
