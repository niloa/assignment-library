var cloud_storage = process.env.CLOUD_DIR;
var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    uploadDir: cloud_storage,
    uploadUrl:  '/app-storage',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)$/i,
    imageTypes:  /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        width:  80,
        height: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    nodeStatic: {
        cache:  3600 // seconds to cache served files
    }
};

var uploader = require('blueimp-file-upload-expressjs')(options);


module.exports = function (router) {
    router.get('/upload', function(req, res) {
        uploader.get(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });

    });

    router.post('/upload', function(req, res) {
        uploader.post(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });

    });

    router.delete('/app-storage/:name', function(req, res) {
        uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });

    });
    return router;
}