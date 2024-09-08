//defining the canvas and context
const canvas=document.getElementById("game-window");
const ctx=canvas.getContext("2d");

//constants for easy use instead of string
const LEVELSBEATEN="levelsbeaten"

const MENU="menu";
const LEVELSELECT="levelselect";
const GAMEPLAY="gameplay";



//constant image and audios
const menuAssets={
    "mainmenu":document.getElementById("mainmenu"),
    "menutext":document.getElementById("menutext"),
    "soundon":document.getElementById("soundon"),
    "soundoff":document.getElementById("soundoff"),
    "levelselect":document.getElementById("levelselect")
}

const music={
    "menu":document.getElementById("menumusic")
}


//variables exclusive to menu
var menuTextY;
var menuTextSpeedY;
var menuTextDelay;
var menuSound;

var events=[];
var keys=[];

var gameLoopTimer;
var state;
var width=canvas.width;
var height=canvas.height;
var actualWidth;
var actualHeight;
var actualTop;
var actualLeft;



function convertMouseposToPosition(mousex,mousey){
    return [(mousex-actualLeft)/(actualWidth/width),(mousey-actualTop)/(actualHeight/height)]
}

function detectBoxCollision(x1,y1,x2,y2,tx,ty){
    if(x1<=tx && x2>=tx && y1<=ty && y2>=ty){
        return true;
    }
    else{
        return false;
    }
}


function menuTick(){
    for(let i=0; i<events.length; i++){
        if(events[i].type=="mousedown"){
            
            if(detectBoxCollision(width*0.98-100,height*0.02,width*0.98,height*0.02+80,
                convertMouseposToPosition(events[i].details.clientX,events[i].details.clientY)[0],
                convertMouseposToPosition(events[i].details.clientX,events[i].details.clientY)[1])){
                    if(menuSound){
                        menuSound=false
                        music.menu.pause()
                    }
                    else{
                        menuSound=true
                        music.menu.play()
                    }
                }
            
        }
        if(events[i].type=="keydown"){
            if(events[i].details.key=="Enter"){
                startLevelselect()
            }
        }
    }
    events=[]
    
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(menuAssets.mainmenu,0,0,width,height)
    ctx.drawImage(menuAssets.menutext,(width-912)/2,menuTextY)

    if(menuTextDelay>0){
        menuTextDelay-=1
    }
    else{
        menuTextY+=menuTextSpeedY;
        menuTextSpeedY+=0.1;
        if(menuTextY>200){
            menuTextSpeedY*=-0.7;
            menuTextY=200;
        }
    }

    if(menuSound){
        ctx.drawImage(menuAssets.soundon,width*0.98-100,height*0.02,100,80);
    }
    else{
        ctx.drawImage(menuAssets.soundoff,width*0.98-100,height*0.02,100,80);
    }
    
}

function levelselectTick(){
    ctx.drawImage(menuAssets.levelselect,0,0,width,height)
}

function gameplayTick(){
    
}



function gameLoop(){
    actualWidth=canvas.getBoundingClientRect().width;
    actualHeight=canvas.getBoundingClientRect().height;
    actualTop=canvas.getBoundingClientRect().top;
    actualLeft=canvas.getBoundingClientRect().left;

    if(state==MENU){
        menuTick();
    }
    if(state==LEVELSELECT){
        levelselectTick();
    }
    if(state==GAMEPLAY){
        gameplayTick;
    }
}


function startGame(){
    
    startMenu()
    gameLoopTimer=setInterval(gameLoop,1/60)
}

function startMenu(){
    state=MENU
    menuTextY=-300
    menuTextSpeedY=0
    menuTextDelay=120;
    menuSound=false;
}

function startLevelselect(){
    state=LEVELSELECT;
    music.menu.pause();
}


startGame()

document.addEventListener("mousedown",function(event){events.push({"type":"mousedown","details":event})})

document.addEventListener("keydown",function(event){
    events.push({"type":"keydown","details":event})
    if(!keys.includes(event.key)){
        keys.push(event.key)
    }
    

    })

    document.addEventListener("keyup",function(event){
        events.push({"type":"keyup","details":event})
        if(keys.includes(event.key)){
            if(keys.indexOf(event.key)>-1){
                keys.splice(keys.indexOf(event.key),1)
            }
        }
        
    
        })