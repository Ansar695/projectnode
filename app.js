const express = require("express")
const app = express()
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const hbs = require("hbs")
const port = 8000;
const http = require("http")

mongoose.connect("mongodb://localhost:27017/picData", {
    
}).then(() => {
    console.log("Connection Successful")
}).catch((err) => {
    console.log("Connection Error")
})

const picSchema = new mongoose.Schema({
    file: String,
    link: String,
    projectName: String,
    bImage: String,
    bTopic: String,
    bDate: String,
    bText: String,
})

const picModel = new mongoose.model("pic", picSchema)
const bModel = new mongoose.model("blogs", picSchema)

const findModel = picModel.find({})
const findBModel = bModel.find({})

app.use(express.static(path.join(__dirname)))
// const partialsPath = path.join(__dirname, './partials')


app.set('view engine', 'hbs')
// hbs.registerPartials(partialsPath)
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req,file,cb) => {
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

let upload = multer({
    storage:storage,
})

// var mulImages = upload.fields([{name: 'file'},{name: 'bImage'}])

app.get("/", (req,res,next) => {
    // findModel.exec((err,data) => {
    //     res.render("index", {
    //         title: "Image Uplaoder",
    //         images: data
    //     })
    // })
    const getDocs = async() => {
        const all_images = await picModel.find()
        res.render("index", {images: all_images})
    }
    getDocs()
    
})

app.get("/blog", (req,res,next) => {
    const getBlogs = async() => {
        const all_blogs = await bModel.find()
        res.render("blog", {blogsData: all_blogs})
    }
    getBlogs()
    
})

app.post("/", upload.single('file'), async(req,res,next) => {
    const picDetails = new picModel({
        file: req.file.filename,
        link: req.body.link,
        projectName: req.body.projectName
    })
    picDetails.save();

    const getDocs = async() => {
        const all_images = await picModel.find()
        res.render("index", {images: all_images})
    }
    getDocs()
})

app.post("/blog", upload.single('bImage'), async(req,res,next) => {
    const bDetails = new bModel({
        bImage: req.file.filename,
        bTopic: req.body.bTopic,
        bDate: req.body.bDate,
        bText: req.body.bText
    })
    await bDetails.save();
    
    const getBlogs = async() => {
        const all_blogs = await bModel.find()
        res.render("blog", {blogsData: all_blogs})
    }
    getBlogs()
})

app.get("/delete/:id", (req,res,next) => {
    var id = req.params.id
    var del = picModel.findByIdAndDelete(id)

    del.exec(function(err,data){
        if(err) throw err;
        res.redirect("/")
    })

})

app.listen(port, () => {
    console.log(`Listening to the port no ${port}`)
})