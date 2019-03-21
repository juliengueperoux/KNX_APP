const UserModel = require('../models/user')

exports.add = (req, res) => {
    req.body.password = new UserModel().generateHash(req.body.password);
    UserModel.findOne({
        $or:[
            {username: req.body.username},
            {mail : req.body.mail}
            ]
    }, 
    (err, result) => {
        if(err) return res.status(409);
        if(result) return res.send({success:false, errorMessage:"User already exist"});
        else {
            UserModel.create(req.body, (err, result) => {
                if(err) return res.status(409);
                return res.send({success:true});
          })
        }
	});
};

exports.findOneAdmin = (req,res) => {
        let idUser = req.params._id;
        UserModel.findOne({ '_id': idUser}, (err, result) => {
            if(err) return res.send({success : false, errorMessage : "Erreur lors de la récupération de l'user : "+err});
            return res.send(result);
        });
};

exports.findOne = (req,res) => {
    let idUser = req.apiToken._id;
    UserModel.findOne({ '_id': idUser},"admin username mail", (err, result) => {
        if(err) return res.send({success : false, errorMessage : "Erreur lors de la récupération de l'user : "+err});
        return res.send(result)
    });
};

exports.findAll = (req,res) =>{
    UserModel.find({}, (err, results) =>{
        if(err) console.log(err);
        return res.send(results);
    });
};

exports.findAllAdministration = (req,res) =>{
    UserModel.find({},"username mail admin validAccount", (err, results) =>{
        if(err) console.log(err);
        return res.send(results);
    });
};

exports.deleteAdmin = (req, res) => {
    let id = req.params.id;
    UserModel.deleteOne({'_id': id}, (err,result) =>{
        if(err) return res.send({success : false,errorMessage : "erreur lors de la suppression de l'utilisateur"});
        if(result){
                return res.send({success : true});
        }
    })
};

exports.delete = (req, res) => {
    UserModel.deleteOne({'_id': req.apiToken._id}, (err,result) =>{
        if(err) return res.send({success : false,errorMessage : "erreur lors de la suppression de l'utilisateur"});
        else if(result){
                return res.send({success : true});
        }
    })
};


exports.findIfExist = (req, res) => {
    UserModel.findOne({ $or : [ {"username":req.body.username}, {"mail": req.body.mail} ] }, (err, result) => {
        if(err) return res.status(409);
        if(result){
            if(result.mail === req.body.mail) return res.send({success : true, errorMessage : "Adresse email déjà utilisée"})
            else if(result.username === req.body.username) return res.send({success : true, errorMessage : "Username déjà utilisé"})
            else return res.send({success : false})
        }
        else return res.send({success : false})
    });
 };