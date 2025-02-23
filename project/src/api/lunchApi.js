const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

// Enable CORS so that requests from the front end are allowed
app.use(cors());

// Replace this URL with the actual URL from which you want to scrape the lunch data.
const TARGET_URL = "https://strav.nasejidelna.cz/0341/login";

async function scrapeJecnaLunches() {
    try {
        const { data: html } = await axios.get(TARGET_URL, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
            }
        });

        const $ = cheerio.load(html);
        const days = [];

        // Iterate over each day block on the page.
        $(".jidelnicekDen").each((i, dayElem) => {
            const dayHeader = $(dayElem).find(".jidelnicekTop").text().trim();
            const dateMatch = dayHeader.match(/\d{2}\.\d{2}\.\d{4}/);
            const date = dateMatch ? dateMatch[0] : "Unknown date";

            const lunches = [];

            // Process each lunch container.
            $(dayElem)
                .find(".container")
                .each((j, container) => {
                    const hallName = $(container)
                        .find(".shrinkedColumn.jidelnicekItem span")
                        .text()
                        .trim();

                    // Only process containers where the dining hall is "Ječná"
                    if (hallName.includes("Ječná")) {
                        const lunchType = $(container)
                            .find(".shrinkedColumn.smallBoldTitle.jidelnicekItem span")
                            .text()
                            .trim();

                        // Clone the details element, then remove sub elements (nutritional info)
                        const $lunchDetailsElem = $(container)
                            .find(".column.jidelnicekItem")
                            .clone();
                        $lunchDetailsElem.find("sub").remove();
                        const lunchDetails = $lunchDetailsElem.text().trim();

                        lunches.push({
                            type: lunchType,
                            details: lunchDetails
                        });
                    }
                });

            if (lunches.length > 0) {
                days.push({
                    date,
                    lunches
                });
            }
        });

        return days;
    } catch (error) {
        console.error("Error fetching or scraping:", error.message);
        throw error;
    }
}

// Create an API endpoint to return the scraped "Ječná" lunches.
app.get("/api/jecnalunches", async (req, res) => {
    try {
        const data = await scrapeJecnaLunches();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape lunch data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});