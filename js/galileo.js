decisionmins = 0;

scienceHours = 0;
eatingHours = 0;
workingHours = 0;
decisionHours = 0;
sleepHours = 0;

scienceMoney = 0;
eatingMoney = 0;
rent = 40;

dayNum = 1;

papers = 0;
balance = 100;
health = 100;
reputation = 50;

modal_open = false;

metrics_content="";

$(document).ready(function() {
  $('select').material_select();
  sleepHours = 24;
  $("#sleep_hours_label").html(24);
  updateMetrics();
  init();
});

var currentEncounter;

function setEatingHours(val){
  $("#eating_hours").val(val);
  $("#eating_hours").material_select();
}

function setEatingHoursMax(val){
  for(var i = 0; i <= 3; i++){
    if(i <= val){
      $("#eating_hours option[value='"+i+"']").prop("disabled",false);
    }else{
      $("#eating_hours option[value='"+i+"']").prop("disabled",true);
    }
  }
  $("#eating_hours").material_select();
}

function adjustTimeMaxes(){
  $("#science_hours").prop("max",24-eatingHours-workingHours-decisionHours);
  $("#science_hours_max_label").html(24-eatingHours-workingHours-decisionHours);
  $("#working_hours").prop("max",24-eatingHours-scienceHours-decisionHours);
  $("#working_hours_max_label").html(24-eatingHours-scienceHours-decisionHours);
  setEatingHoursMax(24-workingHours-scienceHours-decisionHours);
  sleepHours = 24-eatingHours-workingHours-decisionHours-scienceHours;
  $("#sleep_hours_label").html(sleepHours);
}

function adjustMoneyMaxes(){
  var science_money_max = (balance-eatingMoney-rent < 0? 0 :balance-eatingMoney-rent);
  $("#science_money").prop("max",science_money_max);
  $("#science_money_max_label").html(science_money_max);
  var eating_money_max = (balance-scienceMoney-rent < 0? 0 :balance-scienceMoney-rent);
  $("#eating_money").prop("max",eating_money_max);
  $("#eating_money_max_label").html(eating_money_max);
}

function updateMetrics(){
  var metrics_content = "<div class=\"col s6 m6 l3\"><center>Papers: "+papers+"</center></div><div class=\"col s6 m6 l3\"><center>Reputation: "+reputation+"%</center></div><div class=\"col s6 m6 l3\"><center>Money: $"+balance+"</center></div><div class=\"col s6 m6 l3\"><center>Health: "+health+"%</center></div>";
  $(".metrics-row").html(metrics_content);
}

function resetInput(){
  decisionmins = 0;
  $("#decision_hours").css("width", "0%");

  /*scienceHours = 0;
  $("#science_hours").val(0);
  $("#science_hours_label").html($("#science_hours").val());
  eatingHours = 0;
  $("#eating_hours").val(0);
  $("#eating_hours_label").html($("#eating_hours").val());
  workingHours = 0;
  $("#working_hours").val(0);
  $("#working_hours_label").html($("#working_hours").val());*/
  // no resetting input
  decisionHours = 0;
  $("#decision_hours_label").html(decisionHours);

/*
  sleepHours = 24;
  $("#sleep_hours_label").html(24);*/

  /*scienceMoney = 0;
  $("#science_money").val(0);
  $("#science_money_label").html($("#science_money").val());
  eatingMoney = 0;
  $("#eating_money").val(0);
  $("#eating_money_label").html($("#eating_money").val());*/
  adjustMoneyMaxes();
  adjustTimeMaxes();

}

var encounters = [
  {
    title: "Plagiarize",
    content: "You're in need of some cash! You obtained a design for a new optical instrument from Holland. Even if the people find out, which they probably won't, the Dutch won't be able to claim ownership of the design, since it doesn't seem to be patented.<br><br>You'll paint your device red just to be safe though.",
    effect: "+$50 money, risking reputation",
    refusalEffect: "Nothing",
    apply: function(){
      papers++;
      reputation-=20;
      balance+=50;
      return "Oops, you got caught. You lost 20% reputation as a result. However, you already earned a ton of money, so you don't really care.";
    },
    refuse: function(){
      return "Smart choice. You don't want to be risking your reputation for something small like this.";
    }
  },
  {
    title: "Florence",
    content: "Through careful observation through your telescope, you found that Copernicus's heliocentric model of the solar system is, in fact, consistent with your data. You wish to travel to Florence in order to present your findings to the academic persons there. Your friend warns you that despite the clarity of your evidence, the monks may still view your finding as heretical and find reasons to kill you. Will you go to Florence?",
    effect: "Travel spending, risking reputation",
    refusalEffect: "Risking renoun (reputation)",
    apply: function(){
      reputation-=20;
      health-=10;
      balance-=10;
      return "You spend $10 to get to Florence, but the university professors don't take it well! They totally refuse to look through your telescope and review the clear evidence, and are skeptical of your findings because they would topple over 2000 years of popular conception. You lose 20% reputation and 10% health (as a result of travel).";
    },
    refuse: function(){
      reputation-=(reputation<0? reputation: reputation/3);
      return "Your work is quickly forgotten. You lose one third of your reputation. "
    }
  },
  {
    title: "Language",
    content: "You know that you'll be prosecuted for publishing your results, but you hope that your radical ideas will spread quickly among the people. Thus, you contemplate whether to write your paper in common language or in academic latin, which is more common for scientific papers. Would you like to write your paper in plain language?",
    effect: "Bigger audience for your paper",
    refusalEffect: "Unknown",
    apply: function(){
      reputation+=10;
      balance+=50;
      return "Congratulations! You paper sells well in the street, and you get $50 money and 10% reputation. Watch out for the authorities though. ";
    },
    refuse: function(){
      return "Oops. One of your students gets the manuscript and translates it into vernacular language without your consent in order to sell it. You get nothing."
    }
  },
  {
    title: "Continuation",
    content: "Someone warns you that the Pope (yes, the Pope) has objected against your work. The Inquisition threatens to torture and/or kill you. Will you continue to work and boldly defend your beliefs?",
    effect: "Risking the wrath of the Catholic Church",
    refusalEffect: "Risking reputation",
    apply: function(){
      reputation-=10;
      papers+=0.2;
      return "You continue working overtime and write another 0.2 papers. You lose some reputation (10%) on the streets due to the Pope's opposition.";
    },
    refuse: function(){
      reputation-=50;
      health-=30;
      return "Once you stop defending your beliefs, the people stop believing in your scientific research. Your reputation drops severely (50%). You also mysteriously contract pneumonia, which causes you to lose 30% health.";
    }
  },
  {
    title: "Recant",
    content: "The Inquisition shows you their instruments of torture, and they look really painful. They expect you to either recant at 5 o' clock or be tortured and possibly killed. Do you recant your beliefs?",
    effect: "You probably won't die, but you risk your reputation.",
    refusalEffect: "You're probably going to die. Probably. (In other words, you're risking your health)",
    apply: function(){
      reputation=(reputation<0? reputation: reputation/4);
      return "You recant your beliefs, and the Inquisition keeps you on house arrest for the rest of your life. Recanting your beliefs causes you to lose 75% of your accumulated reputation.<br><br>By the way, this isn't the end of the simulation! There are still two more days left of the week.";
    },
    refuse: function(){
      health=(health<1 ? health : 1);
      return "You get tortured by the inquisition. However, through a great demonstration of perseverance, you continue to refuse to stray away from your beliefs. Fortunately, the Inquisition has mercy on you and leaves you alone for now. (Your health decreases to 1%)<br><br>By the way, this isn't the end of the simulation! There are still two more days left of the week.";
    }
  }
];

function applyEncounter(){

  $("#encounter-result-title").html("Accepted");
  $("#encounter-result-content").html(currentEncounter.apply());
  $("#encounter-result-popup").openModal({dismissible: false});
  modal_open = true;
  balance=roundNum(balance,2);
  health=roundNum(health,2);
  papers=roundNum(papers,2);
  reputation=roundNum(reputation,2);
  resetInput();
  updateMetrics();
}

function refuseEncounter(){

  $("#encounter-result-title").html("Refused");
  $("#encounter-result-content").html(currentEncounter.refuse());
  $("#encounter-result-popup").openModal({dismissible: false});
  modal_open = true;
  balance=roundNum(balance,2);
  health=roundNum(health,2);
  papers=roundNum(papers,2);
  reputation=roundNum(reputation,2);
  resetInput();
  updateMetrics();
}

var currentEncounterNum = 0;

function encounter(){
  if(currentEncounterNum >= encounters.length){
    return;
  }else{
    currentEncounter = encounters[currentEncounterNum];
  }
  currentEncounterNum++;
  $("#encounter-title").html(currentEncounter.title);

  $("#encounter-content").html(currentEncounter.content+"<br><br>Effect: "+currentEncounter.effect+"<br><br>Effect of Refusal: "+currentEncounter.refusalEffect);
  $("#encounter-popup").openModal({dismissible: false});
  modal_open = true;
}

function gameOver(){
  var finalScore = papers;
  var analysis = "";
  analysis += "Congratulations! Despite your hardships, you managed to write "+papers+" papers.<br>";
  if(health<0){
    analysis+="Unfortunately, your score is invalid because you died of health issues.";
    finalScore = 0;
  }else if(balance<0){
    analysis+="Unfortunately, your score is invalid because you got caught up in deep debt.";
    finalScore = 0;
  }else if(reputation<0){
    analysis+="Unfortunately, your score is invalid because your reputation is so bad that your papers are scoffed at, and have no impact as a result."
    finalScore = 0;
  }
  analysis+= "<br><br><center><h3>Final Score: "+finalScore+"</h3></center>"
  $("#end-title").html("Game Over");
  $("#end-content").html(analysis);
  $("#end-popup").openModal({dismissible: false});
  modal_open = true;
}

function closePopup(){

  if(dayNum>=8){
    gameOver();
  }
  resetInput();
  encounter();
}

function roundNum(num, places){
  return Math.round(num*Math.pow(10,places))/Math.pow(10,places);
}

function processDay(){
  decisionmins = 0;
  $("#decision_hours").css("width", "0%");
  $("#popup-title").html("Day "+dayNum);

  var blurb;

  var deltaPapers = roundNum(scienceHours/50 + scienceMoney/500,2);
  var deltaMoneyDueToSpending = roundNum(0- scienceMoney - eatingMoney - rent,2);
  var deltaMoneyDueToWorking = roundNum(workingHours*8,2);
  var deltaHealthDueToSleep = roundNum((sleepHours > 8? (sleepHours-8)*5: (sleepHours-8)*10),2);
  var deltaHealthDueToEating = roundNum(eatingHours+eatingMoney/5 > 4? ((eatingHours+(eatingMoney/10)-4)*10): ((eatingHours+(eatingMoney/5)-4)*20),2);
  var deltaReputation=roundNum((health-70)/5 + (scienceMoney-20)/20,2);
  if(sleepHours > 10){
    deltaHealthDueToSleep = 10;
  }

  blurb = "You spent " + scienceHours + " hr and $"+scienceMoney+" sciencing. ";
  blurb+= "<br>You have created "+deltaPapers+" papers.";

  blurb+="<br><br>You spent $" + scienceMoney + " on your paper and conducted research with "+health+"% health.";
  blurb+="<br>You have "+(deltaReputation>0?"gained":"lost")+ " "+Math.abs(deltaReputation)+"% reputation because of this."

  blurb+="<br><br>You spent " + eatingHours + " hr and $" + eatingMoney + " eating.";
  blurb+="<br>You have "+(deltaHealthDueToEating>0?"gained":"lost")+" "+Math.abs(deltaHealthDueToEating)+"% health because of this.";

  blurb+="<br><br>You spent " + sleepHours + " hr sleeping.";
  blurb+="<br>You have "+(deltaHealthDueToSleep>0?"gained":"lost")+" "+Math.abs(deltaHealthDueToSleep)+"% health because of this.";

  blurb+="<br><br>You spent " + workingHours + " hr working.";
  blurb+="<br>You have earned $"+deltaMoneyDueToWorking+".";

  blurb+="<br><br>You spent $"+ scienceMoney+" on science, $"+eatingMoney+" on food, and $"+rent+" on rent.";
  blurb+="<br>You spent $"+(scienceMoney+eatingMoney+rent)+" in total.";

  $(".delta-row").html("<div class=\"col s6 m6 l3\"><center>"+(deltaPapers>0?"+":"")+(deltaPapers)+"</center></div><div class=\"col s6 m6 l3\"><center>"+(deltaReputation>0?"+":"")+(deltaReputation)+"</center></div><div class=\"col s6 m6 l3\"><center>"+(deltaMoneyDueToWorking+deltaMoneyDueToSpending>0?"+":"")+(deltaMoneyDueToWorking+deltaMoneyDueToSpending)+"</center></div><div class=\"col s6 m6 l3\"><center>"+(deltaHealthDueToSleep+deltaHealthDueToEating>0?"+":"")+(deltaHealthDueToSleep+deltaHealthDueToEating)+"</center></div>");

  balance+=deltaMoneyDueToSpending+deltaMoneyDueToWorking;
  health+=deltaHealthDueToSleep+deltaHealthDueToEating;
  papers+=deltaPapers;
  reputation+=deltaReputation;

  balance=roundNum(balance,2);
  health=roundNum(health,2);
  papers=roundNum(papers,2);
  reputation=roundNum(reputation,2);
  decisionHours = 0;
  decisionmins = 0;

  $("#popup-content").html(blurb);
  dayNum++;
  $("#day_label").html(dayNum);
  $("#popup").openModal({dismissible: false});
  modal_open = true;
  updateMetrics();
}

function init(){
  $("#science_hours").on('input',function(){
    scienceHours = parseInt($("#science_hours").val());
    $("#science_hours_label").html($("#science_hours").val());
    adjustTimeMaxes();
  });

  $("#working_hours").on('input',function(){
    workingHours = parseInt($("#working_hours").val());
    $("#working_hours_label").html($("#working_hours").val());
    adjustTimeMaxes();
  });

  $("#eating_hours").change(function(){
    eatingHours = parseInt($("#eating_hours").val());
    adjustTimeMaxes();
  });

  $("#science_money").on('input',function(){
    scienceMoney = parseInt($("#science_money").val());
    $("#science_money_label").html($("#science_money").val());
    adjustMoneyMaxes();
  });

  $("#eating_money").on('input',function(){
    eatingMoney = parseInt($("#eating_money").val());
    $("#eating_money_label").html($("#eating_money").val());
    adjustMoneyMaxes();
  });

  $("#done_button").click(function(){
    processDay();
  });

  setInterval(function(){
    if(modal_open){
      return;
    }
    decisionmins++;
    $("#decision_hours").css("width", decisionmins/45*100+"%");
    $("#decision_hours_label").html(decisionHours);
    if(decisionmins >= 45 && sleepHours != 0){
      decisionmins -= 45;
      decisionHours++;
      $("#decision_hours_label").html(decisionHours);
      adjustTimeMaxes();
    }
  },1000)
}
