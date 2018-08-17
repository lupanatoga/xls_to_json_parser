var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

xlsx = require('xlsx');

app.use(bodyParser.json());

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');


/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }

        var wb = xlsx.readFile(req.file.path);

        var to_json = function to_json(workbook) {
            var result = {};
            workbook.SheetNames.forEach(function(sheetName) {
                var roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
                if(roa.length) result[sheetName] = roa;
            });
            return result;
        };

        res.json(to_json(wb));
    });

});

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || '3000', function(){
    console.log('running on 3000...');
});