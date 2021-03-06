var express = require('express')
var buildsRouter = express.Router()
var database = require('../database.js')
var bodyParser = require('body-parser') 
var jsonParser = bodyParser.json()
var fs = require("fs")

buildsRouter.route('/builds')
.get(function (req,res, next) {
    var promises = [];
    promises.push(database.getBuilds().then(function (data) {
        return data;
    }));
    Promise.all(promises).then(function (values) {
        var json = JSON.stringify({
            buildsApi: values[0]
        });
        res.end(json);
    });
 
});

buildsRouter.route('/build/:id').get(function(req, res, next){
    var id = req.params.id
    database.getBuildById(id).then(function(build){
        res.send(build)
    }, next);
});

buildsRouter.route('/build/details/:id').get(function(req, res, next){
    var detailsId = req.params.id
    database.getBuildsByDetailsId(detailsId).then(function(build){
        res.send(build)
    }, next)
});

buildsRouter.post('/build/create',jsonParser, function(req, res){

    var imageId = req.body.imageId 
    //var creationDate = req.body.creationDate
    var comment = req.body.comment
    
    database.createBuild(imageId,comment).then(function(data){
        res.status(200).send(data);
    }, function(error){
        console.log('Error from createbuild in build: ' + error);        
    });
});

buildsRouter.route('/build/date/:year/:month')
.get(function (req,res, next) {
    var year = req.params.year
    var month = req.params.month
    console.log(year)
    
    database.getBuildsByTime(month,year).then(function(result){      
        res.send(result)
    }, next);
});

buildsRouter.route('/build/date/:year')
.get(function (req,res, next) {
    var year = req.params.year
    database.getBuildsByYear(year).then(function(result){      
        res.send(result)
    }, next);
});

module.exports = buildsRouter;