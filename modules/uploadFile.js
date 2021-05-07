var AWS = require('aws-sdk');

function uploadFile(zip_filename) {
    // Set the region 
    AWS.config.update({
        region: "us-east-1",
        credentials: new AWS.Credentials({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        })
    });

    // Create S3 service object
    s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: process.env.ACCESS_POINT, Key: '', Body: ''};
    var file = zip_filename;

    // Configure the file stream and obtain the upload parameters
    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
    console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } if (data) {
        console.log("Upload Success", data.Location);
    }
    });
    // snippet-end:[s3.JavaScript.buckets.upload]
};

module.exports = { uploadFile };