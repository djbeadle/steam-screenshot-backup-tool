const piexif = require('piexifjs');
const fs = require('fs');
const path = require('path');

function toCharCode(input){
    let output = [];
    let s = input.split("");
    for(i = 0; i< s.length; i++){
        output.push(input.charCodeAt(i), 0);
    }

    output.push(0, 0);

    return output;
}


function setDescriptionFile(fileDir, desc){
    // EXIF is a mess.
    return fs.writeFileSync(`${fileDir.split('.').slice(0, -1).join('.')}.txt`, desc)
}

function setDescription(filePath, desc){
    let file_contents = fs.readFileSync(filePath);

    const r = file_contents.toString("binary");

    let zeroth = {}, exifBytes, newData, newJpeg;
    zeroth[piexif.ImageIFD.XPComment] = toCharCode(desc);

    const exifObj = {"0th":zeroth};

    try{
        exifBytes = piexif.dump(exifObj);
        newData = piexif.insert(exifBytes, r);
        newJpeg = Buffer.from(newData, "binary");
        fs.writeFileSync(filePath, newJpeg);
        }
    catch (error){
        console.log(error);
        //This is common, as the commentaries for an image are limited to a very narrow ammount of characters. Kanji, for example, are not supported.
        return fs.writeFileSync(`${filePath.split('.').slice(0, -1).join('.')}.txt`, desc); 
    }
}

module.exports = setDescription;