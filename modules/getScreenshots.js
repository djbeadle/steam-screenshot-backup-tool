const fs = require('fs'),
    path = require('path'),
    sanitize = require("sanitize-filename"),
    axios = require('axios').default,
    setDescription = require('./setDescription');


async function downloadScreenshot(output_folder_name, screenshot_entry, screenshot_id) {
    const screenshot_data = screenshot_entry.game.name;
    const g_name = sanitize(`${screenshot_entry.game.name} (${screenshot_entry.game.appid})`)

    const directory_name = `${output_folder_name}/${g_name}`;
    
    fs.mkdirSync(directory_name, { recursive: true })

    const img_path = `${directory_name}/${screenshot_id}.jpg`;
    const writer = fs.createWriteStream(img_path);
    const request = {
        method: 'get',
        url: screenshot_entry.url,
        responseType: 'stream'
    };

    await axios(request)
        .then(function (response) {
            response.data.pipe(writer);

            // If the screenshot has a description, add it as an embed or .txt
            if (screenshot_entry.description) {
                setDescription(img_path, screenshot_entry.description);
            }
        })
        .catch(function (error) {
            throw error;
        });
}

module.exports = { downloadScreenshot };