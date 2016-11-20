var Intro = function(canvas, done) {
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  this.container = new createjs.Container();
  
  // Background
  var bg = new createjs.Shape();
  bg.graphics.beginFill('black').drawRect(0,0,width,height);
  bg.alpha = 0.6;

  // Button
  var btnBg = new createjs.Shape();
  btnBg.graphics.beginFill('orange').drawRoundRect(0,0,300,60,6);
  btnBg.x = width / 2 - 150;
  btnBg.y = height - 135;
  btnBg.addEventListener('click', done);

  var btnText = new createjs.Text(
    "I'm ready for war",
    '22px Prociono',
    '#fff'
  );
  btnText.textAlign = 'center';
  btnText.x = width / 2;
  btnText.y = height - 120;

  var title = new createjs.Text(
    'Naval Warfare', 
    '42px Prociono', 
    '#ffffff'
  );
  title.textAlign = 'center';
  title.y = 20;
  title.x = width / 2;

  var story = new createjs.Text(
    "The year is 1916 and you are British Admiral, Sir John Jellicoe.\n" +
    "The Germans are approaching and your fleet is running thin...", 
    '18px Prociono', 
    '#ffffff'
  );
  story.textAlign = 'center';
  story.lineHeight = 30;
  story.y = 120;
  story.x = width / 2;

  var credits = new createjs.Text(
    'By: Cameron Moreau', 
    '16px Prociono', 
    '#ffffff'
  );
  credits.x = 10;
  credits.y = height - 30;

  this.container.addChild(
    bg, 
    title, 
    story, 
    credits,
    btnBg,
    btnText
  );
}