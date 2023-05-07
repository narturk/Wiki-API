const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to mongoDB
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')
}

//make the schema
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////// Requests Taragetting A All Articles /////////////////////

app.route("/articles")

  .get(async function(req, res) {
    let foundArticles;
    try {
      foundArticles = await Article.find({});
      res.send(foundArticles);
    } catch (err) {
      res.send(err);
    }

  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    try {
      newArticle.save();
      res.send("Successfully added a new article.");
    } catch (err) {
      res.send(err);
    }
  })

  .delete(async function(req, res) {
    try {
      await Article.deleteMany({});
      res.send("Successfully deleted all articales.");
    } catch (err) {
      res.send(err);
    }
  });

//////////////// Requests Taragetting A Specific Article /////////////////////

app.route("/articles/:articleTitle")

  .get(async function(req, res) {
    let foundArticle;
    try {
      foundArticle = await Article.findOne({
        title: req.params.articleTitle
      });
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article matching that title was found.")
      }
    } catch (err) {
      res.send(err);
    }
  })

  .put(async function(req, res) {
    let articleToDelete;
    try {
      articleToDelete = await Article.updateOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      });
      if (articleToDelete.modifiedCount != 0) {
        res.send("Successfully updated article: " + req.params.articleTitle);
      } else if (articleToDelete.matchedCount == 0) {
        res.send("No article matching that title was found.")
      } else {
        res.send("There is no what to update in article: " + req.params.articleTitle)
      }
    } catch (err) {
      res.send(err);
    }
  })

  .delete(async function(req, res) {
    try {
      await Article.deleteOne({
        title: req.params.articleTitle
      });
      res.send("Successfully deleted articale " + req.params.articleTitle);
    } catch (err) {
      res.send(err);
    }
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
