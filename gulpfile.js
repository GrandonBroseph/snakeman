var gulp         = require("gulp"),
    pug          = require("gulp-pug"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    imagemin     = require("gulp-imagemin"),
    cache        = require("gulp-cache"),
    browserify   = require("gulp-browserify"),
    open         = require("gulp-open"),
    del          = require("del"),
    runSequence  = require("run-sequence"),
    browserSync  = require("browser-sync"),
    ngrok        = require("ngrok"),
    argv         = require("yargs").argv;

config = {
    port:   8080,
    root:   ".",
    start:  "dev",
    finish: "docs"
};

function error(error) {
    console.log(error.toString());
    this.emit("end");
}

gulp.task("pug", function() {
    return gulp.src(config.root+"/"+config.start+"/pug/index.pug")
               .pipe(pug()).on("error", error)
               .pipe(gulp.dest(config.root+"/"+config.finish))
               .pipe(browserSync.stream());
});

gulp.task("sass", function() {
    return gulp.src(config.root+"/"+config.start+"/scss/*.scss")
               .pipe(sass()).on("error", error)
               .pipe(autoprefixer()).on("error", error)
               .pipe(gulp.dest(config.root+"/"+config.finish+"/css"))
               .pipe(browserSync.stream());
});

gulp.task("js", function() {
    return gulp.src(config.root+"/"+config.start+"/js/app.js")
               .pipe(browserify()).on("error", error)
               .pipe(gulp.dest(config.root+"/"+config.finish+"/js"))
               .pipe(browserSync.stream());
});

gulp.task("img", function(){
    return gulp.src(config.root+"/"+config.start+"/img/**/*.+(png|jpg|gif|svg)")
               .pipe(cache(imagemin()))
               .on("error", error)
               .pipe(gulp.dest(config.root+"/"+config.finish+"/img/"));
});

gulp.task("clean", function(callback){
    config.root = (argv.r || argv.root) || config.root;
    console.log("Deleting folder '"+config.root+"/"+config.finish+"/"+"'...");
    return del(config.root+"/"+config.finish+"/**/*", {force: true});
});

gulp.task("build", ["clean"], function(callback) {
    console.log("Preprocessing...");
    runSequence("img", ["pug", "sass", "js"], callback);
});

gulp.task("watch", function(){
    config.root = (argv.r || argv.root) || config.root;
    console.log("Watching scripts in directory '"+config.root+"'...");
    gulp.watch(config.root+"/"+config.start+"/pug/**/*.pug", ["pug"]);
    gulp.watch(config.root+"/"+config.start+"/scss/**/*.scss", ["sass"]);
    gulp.watch(config.root+"/"+config.start+"/js/**/*.js", ["js"]);
    gulp.watch(config.root+"/"+config.start+"/img/**/*.+(png|jpg|gif|svg)", ["img"]);
});

gulp.task("server", function(){
    config.port = (argv.p || argv.port) || config.port;
    browserSync.init({
        server: {
            baseDir: config.root+"/"+config.finish
        },
        notify: false,
        open: false,
        logConnections: true,
        port: config.port
    }, function() {
        console.log("Server listening at localhost:"+config.port);
        ngrok.connect(config.port, function (err, url) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Tunnel created at "+url+".");
        });
    });
});

gulp.task("default", function(){
    config.port   = (argv.p || argv.port) || config.port;
    config.root   = (argv.r || argv.root) || config.root;
    config.start  = (argv.s || argv.start) || config.start;
    config.finish = (argv.f || argv.finish) || config.finish;
    console.log("Project '"+config.root+"' developer mode initialized! Press Ctrl+C to terminate.");
    runSequence("build", "server", "watch");
});
