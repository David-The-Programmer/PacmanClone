function TML5(){
    this.init = function(config){
        this.config = config;
        this.model_url = config.model_url;
        this.video_config = config.video_config;
        this.starting_pos = config.starting_pos;
        this.classifier = ml5.imageClassifier(this.model_url);

        // Vars used later on
        this.video = null;
        this.flipped_video = null;
    };
    this.setUpVideo = function(){
        let video = createCapture(VIDEO);
        video.size(this.video_config.x, this.video_config.y);
        video.hide();
        let flipped_video = ml5.flipImage(video);
        this.flipped_video = flipped_video;
        this.video = video;

    };
    this.classifyVideo = function(){
        this.flipped_video = ml5.flipImage(this.video);
        this.classifier.classify(this.flipped_video, this.processResult.bind(this));
    };
    this.processResult = function(err, results){
        if(err){
            console.log(err);
            return;
        }
        else{
            label = results[0].label;
        }
        this.classifyVideo();
    };
    this.drawVideo = function(){
        // Drawing video
        image(this.video, this.starting_pos.x, this.starting_pos.y);

        // Drawing label
        fill(255);
        textSize(50);
        textAlign(CENTER);
        text(label, this.starting_pos.x + (this.video_config.x / 2), this.starting_pos.y + (this.video_config.y + 50));
    };
}