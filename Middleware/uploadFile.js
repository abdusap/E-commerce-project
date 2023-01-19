const multer = require('multer')
const path = require('path')

// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,path.join(__dirname,'../Public/admin/product'));
//     },
//     filename:function(req,file,cb){
//         const name=Date.now()+'-'+file.originalname;
//         cb(null,name);
//     }
// })
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(console.log("Multer Filter: Must upload an Image"), false);
    }
  };
  const upload = multer({ storage:multer.memoryStorage(), fileFilter: multerFilter });
// const upload=multer({storage:multer.memoryStorage()})

module.exports=upload;