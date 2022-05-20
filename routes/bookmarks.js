const { Category, Bookmark } = require("../db/db");

const app = require("express").Router();

module.exports = app;

app.get("/", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      include: [Category],
    });

    res.send(`
            <html>
                <head>
                    <title>Bookmarks by Categories</title>
                    <link rel='stylesheet' href='/styles.css'/>
                </head>
                <body>
                    <h1>Bookmarks by Categories</h1>
                    <ul>
                        ${bookmarks
                          .map(
                            (bookmark) => `
                            <li>
                                <a href='${bookmark.url}'>${bookmark.name}</a> - <a href='/categories/${bookmark.category.id}'>${bookmark.category.name}</a> bookmark listing
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <p><a href='/bookmarks/add'>Add new bookmark</a></p>
                </body>
            </html>
        `);
  } catch (ex) {
    next(ex);
  }
});

app.get("/add", async (req, res) => {
  const categories = await Category.findAll();
  res.send(
    `
        <html>
                <head>
                    <title>Add a Bookmark</title>
                    <link rel='stylesheet' href='/styles.css'/>
                </head>
                <body>
                    <h1>Add a Bookmark</h1>
                        <div id='add-bm'>
                            <form method='POST' action='/bookmarks'>
                                <div>
                                    <label for='name'>Bookmark Name</label>
                                    <input type='text' name='name'/>
                                </div>
                                <div>
                                    <label for='url'>Bookmark URL</label>
                                    <input type='text' name='url'/>
                                </div>
                                <div>
                                    <label for='category'>Category</label>
                                    <select name='categoryId'>
                                        ${categories
                                        .map(
                                            (category) =>
                                            `
                                                <option value='${category.id}'>${category.name}</option>
                                            `
                                        )
                                        .join("")}
                                    </select>
                                </div>
                                <div>
                                    <button>Add Bookmark</button>
                                </div>
                            </form>
                        </div>
                </body>
        </html>
        `
  );
});

app.post("/", async (req, res, next) => {
  try {
    const bookmarkName = req.body.name;
    const bookmarkUrl = req.body.url;
    const categoryId = req.body.categoryId;
    const bookmark = await Bookmark.create({
      name: bookmarkName,
      url: bookmarkUrl,
      categoryId: categoryId,
    });
    res.redirect(`/categories/${bookmark.categoryId}`);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id, {
      include: [Category],
    });
    await bookmark.destroy();
    res.redirect(`/categories/${bookmark.category.id}`);
  } catch (ex) {
    next(ex);
  }
});
