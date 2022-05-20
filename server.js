const { conn, Category, Bookmark } = require("./db/db");
const expres = require("express");

const app = expres();

app.use(expres.urlencoded({ extended: false }));
app.use(require("method-override")("_method"));
app.use(expres.static("assets"));

app.get("/", (req, res) => res.redirect("/bookmarks"));

app.use("/bookmarks", require("./routes/bookmarks"));

app.use("/categories", require("./routes/categories"));

const init = async () => {
  await conn.sync({ force: true });
  const coding = await Category.create({ name: "coding" });
  const search = await Category.create({ name: "search" });
  const jobs = await Category.create({ name: "jobs" });
  await Bookmark.create({
    name: "Google",
    url: "https://www.google.com/",
    categoryId: search.id,
  });
  await Bookmark.create({
    name: "Stack Overflow",
    url: "https://stackoverflow.com/",
    categoryId: coding.id,
  });
  await Bookmark.create({
    name: "Bing",
    url: "https://www.bing.com/",
    categoryId: search.id,
  });
  await Bookmark.create({
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    categoryId: jobs.id,
  });
  await Bookmark.create({
    name: "Bing",
    url: "https://www.indeed.com/",
    categoryId: jobs.id,
  });
  await Bookmark.create({
    name: "MDN",
    url: "https://developer.mozilla.org/en-US/",
    categoryId: coding.id,
  });
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

app.use((err, req, res, next) => {
  // console.log(err)
  res.status(500).send(err);
});

init();
