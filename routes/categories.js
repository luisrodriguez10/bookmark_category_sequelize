const { Category, Bookmark } = require("../db/db");

const app = require("express").Router();

module.exports = app


app.get("/:id", async (req, res, next) => {
  try {
    const categories = await Category.findByPk(req.params.id, {
      include: [Bookmark],
    });

    res.send(`
            <html>
                <head>
                    <title>${categories.name}</title>
                    <link rel='stylesheet' href='/styles.css'/>
                </head>
                <body>
                    <h1>Bookmarks by ${categories.name}</h1>
                    <ul>
                        ${categories.bookmarks
                          .map(
                            (bookmark) => `
                            <li>
                                ${bookmark.name}
                                <form method='POST' action='/bookmarks/${bookmark.id}?_method=DELETE'>
                                    <button>X</button>
                                </form>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <p><a href='/bookmarks'>Return to Bookmarks Page</a></p>
                </body>
            </html>
        `);
  } catch (ex) {
    next(ex);
  }
});

