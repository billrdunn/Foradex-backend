const http = require('http')

let items = [
    {
      latin: "Amanita muscara",
      common: ["Fly agaric"],
      id: 0
    },
    {
      latin: "Scleroderma citrinum",
      common: ["Common earthball"],
      id: 1
    },
    {
      latin: "Amanita virosa",
      common: ["Destroying angel"],
      id: 2
    }
  ]

const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(items))
})

const PORT = 3001
app.listen(PORT)

console.log('Server running at http://localhost:' + PORT + '/')