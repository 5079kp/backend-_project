const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = 3000


const VIEW_DIR = path.join(__dirname, "..", "view")

const routes = {
  "/": "home.html",
  "/about": "about.html",
  "/contact": "contact.html",
  "/style.css": "style.css",
  "/gsap.js": "gsap.js"
}

const server = http.createServer((req, res) => {
  const fileName = routes[req.url]

  if (!fileName) {
    res.writeHead(404, { "Content-Type": "text/html" })
    return res.end("<h1>404 - Page Not Found</h1>")
  }

  const fullPath = path.join(VIEW_DIR, fileName)

  console.log("Serving:", fullPath) 

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      console.error("FILE ERROR:", err.message)
      res.writeHead(500, { "Content-Type": "text/plain" })
      return res.end("500 - Server Error")
    }

    const ext = path.extname(fullPath)
    const types = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript"
    }

    res.writeHead(200, {
      "Content-Type": types[ext] || "text/plain"
    })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(" Server running at:")
  console.log(`http://localhost:${PORT}`)
})