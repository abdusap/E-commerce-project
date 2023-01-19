const banner=require('../../Model/bannerModel')
const sharp=require('sharp')

const bannerManage=async (req,res)=>{
    try{
      bannerDetails=await banner.find()
      res.render('../views/admin/bannerManage.ejs',{bannerDetails})
    }catch(error){
        console.log(error);
    }
}

const addBanner=(req,res)=>{
    try{
      let images = [];
    for (let i = 0; i < req.files.length; i++) {
      let name = Date.now() + "-" + i + ".webp";
      sharp(req.files[i].buffer)
        .toFormat("webp")
        .webp({ quality: 100 })
        .toFile("Public/user/images/banners/" + name);
      images.push(name);
    }
    let newBanner = new banner({
        name: req.body.name,
        image: images,
      });
      newBanner.save()
      res.redirect('/admin/banner')
    }catch(error){
        console.log(error);
    }
}

const bannerBlock=async (req,res)=>{
    try{
        const id = req.query.id;
        const bannerData = await banner.findById({ _id: id });
        if (bannerData.status == true) {
          await banner.updateOne({ _id: id }, { $set: { status: false } });
          res.redirect("/admin/banner");
        } else {
          await banner.updateOne({ _id: id }, { $set: { status: true } });
          res.redirect("/admin/banner");
        }
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    bannerManage,
    addBanner,
    bannerBlock
     };