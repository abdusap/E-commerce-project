const banner=require('../../Model/bannerModel')

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
    let newBanner = new banner({
        name: req.body.name,
        image: req.files,
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
        console.log(id);
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