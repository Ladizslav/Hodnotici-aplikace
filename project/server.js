const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const TARGET_URL = "https://strav.nasejidelna.cz/0341/login";

let ratings = [];

const users = [
  { id: 1, username: "user1", password: "password1", token: "token1" },
  { id: 2, username: "user2", password: "password2", token: "token2" },
];

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = user;
  next();
};

async function scrapeJecnaLunches() {
  try {
    const { data: html } = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    });

    const $ = cheerio.load(html);
    const days = [];

    $(".jidelnicekDen").each((i, dayElem) => {
      const dayHeader = $(dayElem).find(".jidelnicekTop").text().trim();
      const dateMatch = dayHeader.match(/\d{2}\.\d{2}\.\d{4}/);
      const date = dateMatch ? dateMatch[0] : "Unknown date";

      const lunches = [];

      $(dayElem)
        .find(".container")
        .each((j, container) => {
          const hallName = $(container)
            .find(".shrinkedColumn.jidelnicekItem span")
            .text()
            .trim();

          if (hallName.includes("Ječná")) {
            const lunchType = $(container)
              .find(".shrinkedColumn.smallBoldTitle.jidelnicekItem span")
              .text()
              .trim();

            const $lunchDetailsElem = $(container)
              .find(".column.jidelnicekItem")
              .clone();
            $lunchDetailsElem.find("sub").remove();
            const lunchDetails = $lunchDetailsElem.text().trim();

            lunches.push({
              type: lunchType,
              details: lunchDetails,
            });
          }
        });

      if (lunches.length > 0) {
        days.push({
          date,
          lunches,
        });
      }
    });

    return days;
  } catch (error) {
    console.error("Error fetching or scraping:", error.message);
    throw error;
  }
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ token: user.token, username: user.username });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.get("/api/jecnalunches", async (req, res) => {
  try {
    const data = await scrapeJecnaLunches();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape lunch data." });
  }
});

app.post("/api/rating", authenticate, (req, res) => {
  const { id, price, portion, temperature, appearance } = req.body;
  const userId = req.user.id;

  if (
    isNaN(portion) || portion < 0 || portion > 5 ||
    isNaN(temperature) || temperature < 0 || temperature > 5 ||
    isNaN(appearance) || appearance < 0 || appearance > 5
  ) {
    return res.status(400).json({ error: "Hodnocení musí být v rozsah 0–5." });
  }

  const averageRating = parseFloat(((portion + temperature + appearance) / 3).toFixed(1));

  const existingRatingIndex = ratings.findIndex(
    (r) => r.id === id && r.userId === userId
  );

  if (existingRatingIndex !== -1) {
    ratings[existingRatingIndex] = {
      id,
      userId,
      price,
      portion,
      temperature,
      appearance,
      averageRating,
    };
  } else {
    ratings.push({
      id,
      userId,
      price,
      portion,
      temperature,
      appearance,
      averageRating,
    });
  }

  res.json({ success: true });
});

app.get("/api/ratings", authenticate, (req, res) => {
  const userId = req.user.id;
  const userRatings = ratings.filter((r) => r.userId === userId);
  res.json({ ratings: userRatings, username: req.user.username });
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});