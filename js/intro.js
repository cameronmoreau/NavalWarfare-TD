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
    "I'm ready for battle",
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
    "The year is 1916 and you are British Vice-Admiral, David Beatty.\n" +
    "The Germans are approaching and your fleet is running thin...\n\n" +
    "It is 2:20pm and you must use your Admiral abilities to command\n" +
    "your fleet and hold the Germans back until 7:15am the next morning.\n\n" +
    "Place land units on the coast and naval units in the ocean. The more\n" +
    "German ships you sink, the more money you will get to upgrade your fleet.\n\n" +
    "Best of luck, and don't die.", 
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