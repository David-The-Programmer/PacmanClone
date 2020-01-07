// Loading lib here
const tml5 = new Teach_ML5();


function preload(){
    tml5.init(TEACH_ML5_CONFIG);
}

function setup(){
    tml5.setUpVideo();
    tml5.classifyVideo();
    createCanvas(1000, 1000);
}

function draw(){
    if(label){
        tml5.drawVideo();
    }
}