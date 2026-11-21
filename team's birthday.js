function setup(depth=1,badges=[0,0,0,0,0,0,0]) {
  imageList=[loadImage("attacks/attacks_000.png"),loadImage("attacks/attacks_001.png"),loadImage("attacks/attacks_002.png"),loadImage("attacks/attacks_003.png"),loadImage("attacks/attacks_004.png"),loadImage("attacks/attacks_005.png")]
  songList=[createAudio("Protocol.mp3"),createAudio("End of the line.mp3")];
  spriteList=[];
  badgeList=[];
  for(var i=0;i<9;i++){
    spriteList.push(loadImage("character sprites/character sprites_00"+String(i)+".png"));
  }
  for(var i=0;i<7;i++){
    badgeList.push(loadImage("badges/BADGES_V1_00"+String(i)+".png"));
  }
  currentRunBadges=badges
  badgeDescriptions=[
    "Itemless: Beat the game without items",
    "Hitless: Beat the game without getting hit",
    "Perfection: Use an item while at exactly 10 HP",
    "Gluttony: Use all items in phase 1",
    "Observant: Check at least 5 times",
    "Weak: Deal less than 1 damage with every attack",
    "Mastery: Land 2 frame perfect hits in a row"]
  badgeRarities=[4,5,3,2,1,3,4]
  hitlessBadge=1
  itemlessBadge=1
  timesChecked=0
  weakBadge=1
  framePerfectCombo=0
  maskParticles=[]
  musicToggle=0;
  flavorText=""
  enemySprite=4;
  shake=0;
  enemyPhase=1;
  turnsInPhase=1;
  itemCount=4;
  //myFont=loadFont("Geist_Pixel/Geist_Pixel.ttf")
  //textFont(myFont)
  menu=2;
  // 0 = main menu
  // 1 = outside of fight
  // 2 = in fight
  // 3 = shop
  // 4 = death/win
  playerStats=[1,0,5,0,20,0,0];
  //lv,exp,atk,def,hp,shield,gold
  currentEnemy=0
  currentEnemyStats=[3,18,20,0,0,0];
  //atk,def,hp,totems,res,mce
  turnNum=1
  currentBossAttack=[]
  //1: basic sword
  //2: aiming sword
  currentFrameAttacks=[]
  //type,x,y,size,direction,color
  //1: sword
  //2: party popper
  //3: party popper projectile
  attackNum=0;
  heartPos=[0,0]
  offset=[0,0]
  fightMenuPosition=[1,1];
  fightMenuDepth=1;
  fightTurn=1;
  attackBarPos=-475;
  playerAttacking=0;
  timer=0;
  currentAttackTime=0;
  timedTrigger=false;
  temp=0;
  timeSinceHit=1000;
  keysHeld=[0,0,0,0,0,0]
  playerMoving=false;
  playerCollision=false;
  //up,down,left,right,z,x

  function chooseBossAttack(){
    if(currentEnemyStats[2]<10){
      if(Math.random()<1/5){
        currentBossAttack=[[150,150,750]]
        for (var i=0;i<50;i++){
          addBasicSword(100*i+25,-50,-150,1,-PI/2,100,40,30,10,0.1,0,1);
          addBasicSword(100*i+50,0,-150,1,-PI/2,100,40,30,10,0.1,0,1);
          addBasicSword(100*i+75,50,-150,1,-PI/2,100,40,30,10,0.1,0,1);
          addBasicSword(100*i+100,0,-150,1,-PI/2,100,40,30,10,0.1,0,1);
          temp=[-50,0,50]
          temp=temp[Math.floor(Math.random()*temp.length)]
          addBasicSword(100*i,200,temp,1,PI,100,60,30,5,0,0,1);
          addBasicSword(100*i,-200,temp,1,0,100,60,30,5,0,0,1);
        }
      }else if(Math.random()<1/4){
        currentBossAttack=[[250,250,750]]
        for (var i=0;i<250;i++){
          temp=i*3.2/7.1*PI
          addBasicSword(4*i+50,-300*Math.cos(temp),300*Math.sin(temp),0.6,temp,35,50,50,0,0.3,0,1)
        }
      }else if(Math.random()<1/3){
        currentBossAttack=[[250,250,750]]
        for (var i=0;i<100;i++){
          temp=[-100,-50,0,50,100]
          for(var j=0;j<4;j++){
            temp2=Math.floor(Math.random()*temp.length)
            addBasicSword(95*i+20,temp[temp2],-200,1,-PI/2,100,60,60,50,0,0,1)
            addBasicSword(95*i+40,temp[temp2],-400,1,-PI/2,100,60,60,50,0,0,1)
            temp.splice(temp2,1)
          }
          addBasicSword(95*i+20,temp[0],-200,1,-PI/2,100,60,60,50,0,0,2+Math.floor(Math.random()*2))
          addBasicSword(95*i+40,temp[0],-400,1,-PI/2,100,60,60,50,0,0,2+Math.floor(Math.random()*2))
        }
      }else if(Math.random()<1/2){
        currentBossAttack=[[150,250,750]]
        for (var i=0;i<30;i++){
          temp=[-50,0,50]
          addBasicSword(40*i,temp[Math.floor(Math.random()*temp.length)],-200,1,-PI/2,100,40,30,30,0,0,1);
          addMovingAimingSword(40*i,-150,0,1,0,100,40,30,30,0,1);
          addMovingAimingSword(40*i,150,0,1,PI,100,40,30,30,0,1);
        }
      }else if(Math.random()<1/1){
        currentBossAttack=[[150,150,750]]
        for (var i=0;i<30;i++){
          if(Math.random()<1/3){
            addBasicSword(55*i,-150,50,1,0,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,50,150,1,PI/2,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,150,50,1,PI,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,50,-150,1,-PI/2,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,-150,-50,1,0,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,-50,150,1,PI/2,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,150,-50,1,PI,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,-50,-150,1,-PI/2,100,40,30,0,0.3,0,1);
          }else if(Math.random()<1/2){
            addBasicSword(55*i,-150,150,1,PI/4,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,150,150,1,3*PI/4,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,150,-150,1,5*PI/4,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,-150,-150,1,7*PI/4,100,40,30,0,0.3,0,1);
          }else if(Math.random()<1/1){
            addBasicSword(55*i,-150,0,1,0,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,0,150,1,PI/2,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,150,0,1,PI,100,40,30,0,0.3,0,1);
            addBasicSword(55*i,0,-150,1,-PI/2,100,40,30,0,0.3,0,1);
          }
        }
      }
    }else{
      if(Math.random()<1/5){
        currentBossAttack=[[250,250,750]]
        for (var i=0;i<100;i++){
          if(Math.random()<1/2){
            addPartyPopper(80*i,-250,-100,1,0,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,-250,0,1,0,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,-250,100,1,0,50,40,45,0.5,PI/6,10,1)
          }else{
            addPartyPopper(80*i,250,-100,1,PI,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,250,0,1,PI,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,250,100,1,PI,50,40,45,0.5,PI/6,10,1)
          }
          if(Math.random()<1/2){
            addPartyPopper(80*i,-100,250,1,PI/2,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,0,250,1,PI/2,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,100,250,1,PI/2,50,40,45,0.5,PI/6,10,1)
          }else{
            addPartyPopper(80*i,100,-250,1,-PI/2,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,0,-250,1,-PI/2,50,40,45,0.5,PI/6,10,1)
            addPartyPopper(80*i,-100,-250,1,-PI/2,50,40,45,0.5,PI/6,10,1)
          }
        }
      }else if(Math.random()<1/4){
        currentBossAttack=[[250,250,750]]
        for (var i=0;i<200;i++){
          temp=Math.floor(Math.random()*8)*PI/4
          addMovingAimingSword(35*i,-150*Math.cos(temp),150*Math.sin(temp),1,temp,60,50,30,0,0.2,1,2)
        }
      }else if(Math.random()<1/3){
        currentBossAttack=[[250,250,750]]
        for (var i=0;i<200;i++){
          addPartyPopper(40*i,0,-250,1,-PI/2,200,40,7,0.9,PI/2,4,1)
        }
      }else if(Math.random()<1/2){
        currentBossAttack=[[250,100,750]]
        for(var i=0;i<30;i++){
          addBasicSword(80*i+50,-200,0,1,0,100,40,50,5,0,PI/2,Math.floor(Math.random()*2)+2,2)
          addBasicSword(80*i+50,200,0,1,PI,100,40,50,5,0,3*PI/2,Math.floor(Math.random()*2)+2,2)
        }
      }else if(Math.random()<1/1){
        currentBossAttack=[[250,250,750]]
        for(var i=0;i<30;i++){
          temp=Math.random()*180-90
          addBasicSword(100*i+50,-300,temp-105,1,0,250,1,0,2,0,3*PI/2,1,2)
          addBasicSword(100*i+50,-300,temp-225,1,0,250,1,0,2,0,3*PI/2,1,2)
          addBasicSword(100*i+50,-300,temp+105,1,0,250,1,0,2,0,PI/2,1,2)
          addBasicSword(100*i+50,-300,temp+225,1,0,250,1,0,2,0,PI/2,1,2)
          temp=Math.random()*180-90
          addBasicSword(100*i+50,300,temp+105,1,PI,250,1,0,2,0,3*PI/2,1,2)
          addBasicSword(100*i+50,300,temp+225,1,PI,250,1,0,2,0,3*PI/2,1,2)
          addBasicSword(100*i+50,300,temp-105,1,PI,250,1,0,2,0,PI/2,1,2)
          addBasicSword(100*i+50,300,temp-225,1,PI,250,1,0,2,0,PI/2,1,2)
        }
      }
    }
  }
  function addBasicSword(time,x,y,size,direction,duration,chargeTime,chargeSize,speed,acceleration,rotation,color,skin=1){
    currentBossAttack.push([1,time,x,y,size,direction,duration,chargeTime,chargeSize,speed,acceleration,rotation,color,skin])
  }
  function addStaticAimingSword(time,x,y,size,direction,duration,chargeTime,chargeSize,speed,acceleration,color){
    currentBossAttack.push([2,time,x,y,size,direction,duration,chargeTime,chargeSize,speed,acceleration,0,color])
  }
  function addMovingAimingSword(time,x,y,size,direction,duration,chargeTime,chargeSize,speed,acceleration,color,skin=1){
    currentBossAttack.push([3,time,x,y,size,direction,duration,chargeTime,chargeSize,speed,acceleration,0,color,skin])
  }
  function addPartyPopper(time,x,y,size,direction,duration,chargeTime,projectileSpeed,speedExponent,spread,amount,color){
    currentBossAttack.push([4,time,x,y,size,direction,duration,chargeTime,projectileSpeed,speedExponent,spread,amount,0,color])
  }
  //5,time,x,y,size,direction,duration,speed,speedExponent,color
  function createAttacks(){
    currentFrameAttacks=[]
    for (var i=1;i<currentBossAttack.length;i++){
      temp=currentBossAttack[i]
      if(temp[0]==1){
        if(currentAttackTime>temp[1]&&currentAttackTime<=temp[1]+temp[7]){
          if(temp[13]==2){
            temp[13]=4+Math.floor(2*Math.random())
          }
          currentFrameAttacks.push([temp[13],
            temp[2]-temp[8]*Math.cos(temp[5])*Math.pow((currentAttackTime-temp[1])/temp[7],0.4),
            temp[3]+temp[8]*Math.sin(temp[5])*Math.pow((currentAttackTime-temp[1])/temp[7],0.4),
            temp[4],
            temp[5]+temp[11],
            temp[12]])
        }
        if(currentAttackTime<temp[1]+temp[7]+temp[6]&&currentAttackTime>temp[1]+temp[7]){
          currentFrameAttacks.push([temp[13],
            temp[2]-temp[8]*Math.cos(temp[5])+Math.cos(temp[5])*(temp[9]+temp[10]*(currentAttackTime-temp[1]-temp[7]))*(currentAttackTime-temp[1]-temp[7]),
            temp[3]+temp[8]*Math.sin(temp[5])-Math.sin(temp[5])*(temp[9]+temp[10]*(currentAttackTime-temp[1]-temp[7]))*(currentAttackTime-temp[1]-temp[7]),
            temp[4],
            temp[5]+temp[11],
            temp[12]])
        }
      }else if(temp[0]==2){
        if(currentAttackTime==temp[1]){
          currentBossAttack[i][0]=1;
          currentBossAttack[i][2]+=heartPos[0]
          currentBossAttack[i][3]+=heartPos[1]
        }
      }else if(temp[0]==3){
        if(currentAttackTime>temp[1]&&currentAttackTime<=temp[1]+temp[7]-15){
          if(temp[13]==2){
            temp[13]=4+Math.floor(2*Math.random())
          }
          currentFrameAttacks.push([temp[13],
            heartPos[0]+temp[2]-temp[8]*Math.cos(temp[5])*Math.pow((currentAttackTime-temp[1])/temp[7],0.4),
            heartPos[1]+temp[3]+temp[8]*Math.sin(temp[5])*Math.pow((currentAttackTime-temp[1])/temp[7],0.4),
            temp[4],
            temp[5]+temp[11],
            temp[12]])
        }
        if(currentAttackTime<temp[1]+temp[7]+temp[6]&&currentAttackTime>temp[1]+temp[7]-16){
          currentBossAttack[i][0]=1;
          currentBossAttack[i][2]+=heartPos[0]
          currentBossAttack[i][3]+=heartPos[1]
        }
      }else if(temp[0]==4){
        if(currentAttackTime>temp[1]&&currentAttackTime<=temp[1]+temp[7]){
          currentFrameAttacks.push([2,
            temp[2],
            temp[3],
            temp[4],
            temp[5]+temp[12],
            temp[13]])
        }
        if(currentAttackTime==temp[1]+temp[7]+1){
          for(var j=0;j<temp[11];j++){
            currentBossAttack.push([5,
              temp[1]+temp[7],
              temp[2],
              temp[3],
              temp[4],
              temp[5]+(Math.random()-0.5)*temp[10],
              temp[6],
              temp[8]*(Math.random()*0.3+0.7),
              temp[9],
              temp[13]]);
          }
        }
      }else if(temp[0]==5){
        //5,time,x,y,size,direction,duration,speed,speedExponent,color
        if(currentAttackTime<temp[1]+temp[6]){
          currentFrameAttacks.push([3,
            temp[2]+Math.cos(temp[5])*temp[7]*Math.pow(currentAttackTime-temp[1],temp[8]),
            temp[3]-Math.sin(temp[5])*temp[7]*Math.pow(currentAttackTime-temp[1],temp[8]),
            temp[4],
            temp[5],
            temp[9]])
        }
      }
    }
  }
  function drawAttacks(){
    for (var i=0;i<currentFrameAttacks.length;i++){
      push()
      translate(currentFrameAttacks[i][1]+offset[0],currentFrameAttacks[i][2]+offset[1])
      rotate(-currentFrameAttacks[i][4])
      scale(currentFrameAttacks[i][3])
      imageMode(CENTER);
      if(currentFrameAttacks[i][5]==2){
        tint(0,128,255)
      }else if(currentFrameAttacks[i][5]==3){
        tint(255,128,0)
      }else if(currentFrameAttacks[i][5]==4){
        tint(255,255,255,128)
      }
      if(currentFrameAttacks[i][0]==1){
        rotate(PI/4)
        image(imageList[0],-5,-5,100,100)
        noTint()
        fill(255,0,0,128)
        rotate(-PI/4)
        //rect(-75,-25,150,50)
      }else if(currentFrameAttacks[i][0]==2){
        image(imageList[1],0,0,200,200)
        noTint()
        fill(255,0,0,128)
        //rect(-75,-25,150,50)
      }else if(currentFrameAttacks[i][0]==3){
        image(imageList[2+Math.floor(currentAttackTime%10/5)],0,0,200,200)
        noTint()
        fill(255,0,0,128)
        //rect(-25,-25,50,50)
      }else if(currentFrameAttacks[i][0]==4){
        rotate(PI/4)
        image(imageList[4],0,0,140,140)
        noTint()
        fill(255,0,0,128)
        rotate(-PI/4)
        //rect(-75,-25,150,50)
      }else if(currentFrameAttacks[i][0]==5){
        rotate(PI/4)
        image(imageList[5],0,0,140,140)
        noTint()
        fill(255,0,0,128)
        rotate(-PI/4)
        //rect(-75,-25,150,50)
      }
      pop()
    }
  }
  function detectCollision(){
    playerCollision=false
    for(var i=0;i<currentFrameAttacks.length;i++){
      if(currentFrameAttacks[i][0]==1||currentFrameAttacks[i][0]==4||currentFrameAttacks[i][0]==5){
        temp=[150,50]
      }else if(currentFrameAttacks[i][0]==3){
        temp=[50,50]
      }else{
        temp=[0,0]
      }
      if(touchingPlayer(currentFrameAttacks[i][1],currentFrameAttacks[i][2],currentFrameAttacks[i][3],currentFrameAttacks[i][4],temp[0],temp[1])&&temp!=[0,0]){
        if(currentFrameAttacks[i][5]==1){
          playerCollision=true
        }else if(currentFrameAttacks[i][5]==2&&playerMoving==true){
          playerCollision=true
        }else if(currentFrameAttacks[i][5]==3&&playerMoving==false){
          playerCollision=true
        }
      }
    }
  }
  function touchingPlayer(x,y,size,direction,hitboxWidth,hitboxHeight){
    temp=heartPos.slice()
      temp[0]-=x
      temp[1]-=y
      temp=[temp[0]*Math.cos(direction)-temp[1]*Math.sin(direction),temp[1]*Math.cos(direction)+temp[0]*Math.sin(direction)]
      temp[0]/=size*hitboxWidth/Math.pow(2,0.5)
      temp[1]/=size*hitboxHeight/Math.pow(2,0.5)
      temp=[temp[0]*Math.cos(PI/4)-temp[1]*Math.sin(PI/4),temp[1]*Math.cos(PI/4)+temp[0]*Math.sin(PI/4)]
      return(Math.abs(temp[0])+Math.abs(temp[1])<=1)
  }
  function takeDamage(){
    hitlessBadge=0;
    temp=randomizeDamage(currentEnemyStats[0]*(1-playerStats[3]/25))
    for (var i=0;i<temp;i++){
      if(playerStats[5]>0){
        playerStats[5]-=1
      }else{
        playerStats[4]-=1
      }
    }
  }
  function randomizeDamage(damage){
    if(Math.random()<damage%1)
      return Math.ceil(damage)
    else{
      return Math.floor(damage)
    }
  }
  if(depth==1){
    window.addEventListener("keydown", (e) => {
      if (e.key=="ArrowUp") {
        keysHeld[0]=1
      };
    });
    window.addEventListener("keydown", (e) => {
      if (e.key=="ArrowDown") {
        keysHeld[1]=1
      };
    });
    window.addEventListener("keydown", (e) => {
      if (e.key=="ArrowLeft") {
        keysHeld[2]=1
        if(menu==2&&fightTurn==1){
          if(fightMenuDepth==1&&fightMenuPosition[0]!=1){
            fightMenuPosition[0]-=1;
          }
          if(fightMenuDepth==2&&fightMenuPosition[1]!=1&&fightMenuPosition[1]!=3){
            fightMenuPosition[1]-=1;
          };
        }else if(menu==4&&badgeSelection>0){
          badgeSelection-=1;
        }
      };
    });
    window.addEventListener("keydown", (e) => {
      if (e.key=="ArrowRight") {
        keysHeld[3]=1
        if(menu==2&&fightTurn==1){
          if(fightMenuDepth==1&&fightMenuPosition[0]!=3){
            fightMenuPosition[0]+=1;
          }
          if(fightMenuDepth==2&&fightMenuPosition[1]!=2&&fightMenuPosition[1]!=4){
            fightMenuPosition[1]+=1;
          };
        }else if(menu==4&&badgeSelection<6){
          badgeSelection+=1;
        }
      };
    });
    window.addEventListener("keydown", (e) => {
      if (e.key=="z") {
        keysHeld[4]=1
        if(menu==2&&fightTurn==1){
          if(fightMenuDepth==1){
            if(fightMenuPosition[0]==1){
              fightMenuDepth=3;
              attackBarPos=-465;
            }else if(fightMenuPosition[0]==2){
              fightMenuDepth=2;
              timer=1;
              timesChecked+=1
              if(timesChecked>=5){
                currentRunBadges[4]=1;
              }
            }else if(fightMenuPosition[0]==3){
              fightMenuDepth=2;
              timer=1;
              itemText=useItem();
            }
          }
          if(fightMenuDepth==3 && attackBarPos>=-460 && playerAttacking==0){
            timer=75;
            playerAttacking=1;
            currentHitDamage=Math.round(10*((50/(50+Math.abs(attackBarPos)))*playerStats[2]*(1-currentEnemyStats[1]/25))*1.25*(1+Math.random()/5))/10;
            if(currentHitDamage>=1){
              weakBadge=0;
            }
            if(attackBarPos==0){
              framePerfectCombo+=1
              if(framePerfectCombo>=2){
                currentRunBadges[6]=1;
              }
            }else{
              framePerfectCombo=0
            }
          };
          if(fightMenuDepth==2 && fightMenuPosition[0]==2 && timer==0){
            startEnemyTurn();
          };
          if(fightMenuDepth==2 && fightMenuPosition[0]==3 && timer==0){
            startEnemyTurn();
          };
        }else if(menu==4){
          setup(depth+1,currentRunBadges)
        }
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key=="x") {
        keysHeld[5]=1
      };
    });
    window.addEventListener("keyup", (e) => {
      if (e.key=="ArrowUp") {
        keysHeld[0]=0
      };
    });
    window.addEventListener("keyup", (e) => {
      if (e.key=="ArrowDown") {
        keysHeld[1]=0
      };
    });
    window.addEventListener("keyup", (e) => {
      if (e.key=="ArrowLeft") {
        keysHeld[2]=0
      };
    });
    window.addEventListener("keyup", (e) => {
      if (e.key=="ArrowRight") {
        keysHeld[3]=0
      };
    });
    window.addEventListener("keyup", (e) => {
      if (e.key=="z") {
        keysHeld[4]=0
      };
    });
    window.addEventListener("keyup", (e) => {
      if (e.key=="x") {
        keysHeld[5]=0
      };
    });
  }
  function playerMovement(){
    if(keysHeld[5]==1){
      speed=2;
    }else{
      speed=4;
    }
    temp=[heartPos[0],heartPos[1]]
    if(keysHeld[0]==1){
      if(heartPos[1]>-currentBossAttack[0][1]/2+20){
        heartPos[1]-=speed
      }else{
        heartPos[1]=-currentBossAttack[0][1]/2+20
      }
    }
    if(keysHeld[1]==1){
      if(heartPos[1]<currentBossAttack[0][1]/2-20){
        heartPos[1]+=speed
      }else{
        heartPos[1]=currentBossAttack[0][1]/2-20
      }
    }
    if(keysHeld[2]==1){
      if(heartPos[0]>-currentBossAttack[0][0]/2+20){
        heartPos[0]-=speed
      }else{
        heartPos[0]=-currentBossAttack[0][0]/2+20
      }
    }
    if(keysHeld[3]==1){
      if(heartPos[0]<currentBossAttack[0][0]/2-20){
        heartPos[0]+=speed
      }else{
        heartPos[0]=currentBossAttack[0][0]/2-20
      }
    }
    playerMoving=!(temp[0]==heartPos[0]&&temp[1]==heartPos[1])
  }

 
  function drawButtons(){
    fill(0,0,0);
    stroke(255,128,0);
    strokeWeight(6);
    rect(100,700,175,75);
    rect(425,700,175,75);
    rect(750,700,175,75);
    textSize(30);
    fill(255,128,0);
    strokeWeight(0.5);
    stroke(255,128,0);
    textAlign("center");
    text("FIGHT",210,750);
    text("ACT",535,750);
    text("ITEM",860,750);
  };

  function drawHeart(x,y){
    noStroke();
    fill(255,0,0);
    if(timeSinceHit<=40){
      fill(255,0,0,160)
    }
    beginShape();
    vertex(x,y+15);
    vertex(x+15,y);
    vertex(x+15,y-10);
    vertex(x+10,y-15);
    vertex(x+5,y-15);
    vertex(x,y-10);
    vertex(x-5,y-15);
    vertex(x-10,y-15);
    vertex(x-15,y-10);
    vertex(x-15,y);
    endShape();
  };

  function drawStats(){
    fill(255,255,255);
    textSize(35);
    textAlign("left");
    strokeWeight(0.5);
    stroke(255,255,255)
    text("JAYDEN",175,675);
    text("LV"+playerStats[0],400,675);
    text("HP",840,675);
    if(playerStats[5]==0){
      text(playerStats[4]+"/20",900,675);
    }else{
      text(playerStats[4]+"/20"+" [+"+playerStats[5]+"]",900,675);
    }
    drawHealthBar();
  };

  function drawHealthBar(){
    strokeWeight(4);
    stroke(100,100,100);
    fill(0,0,0);
    rect(523,643,304,39)
    noStroke();
    fill(255,0,0);
    rect(525,645,15*playerStats[4],35);
    fill(255,255,0);
    rect(530,650,29/2*playerStats[5],25);
  };

  function drawEnemyHealthBar(){
    strokeWeight(4);
    stroke(100,100,100);
    fill(0,0,0);
    rect(523,73,304,39)
    noStroke();
    fill(255,0,0);
    rect(525,75,15*currentEnemyStats[2],35);
  };

  function drawSlash(x,y,size,phase){
    noStroke();
    fill(200,0,0);
    push();
    translate(x,y);
    rotate(-PI/3);
    beginShape();
    vertex((-100*Math.pow(phase,2)+50)*size,0);
    vertex((-50*(Math.pow(phase,2)+(1-Math.pow(1-phase,2)))+50)*size,5*size);
    vertex((-100*(1-Math.pow(1-phase,2))+50)*size,0);
    vertex((-50*(Math.pow(phase,2)+(1-Math.pow(1-phase,2)))+50)*size,-5*size);
    endShape();
    pop();
  };

  function drawDamageText(x,y,size,phase,damage){
    strokeWeight(4);
    stroke(255,0,0,255*Math.pow((1-phase),0.5));
    fill(0,0,0,255*Math.pow((1-phase),0.5));
    push();
    translate(x,y-20*Math.pow(phase,0.5));
    textAlign("center");
    textSize(size*50);
    text(damage,0,0);
    pop();
  };

  function drawBox(x,y){
    strokeWeight(6);
    stroke(255,128,0);
    fill(0,0,0);
    if(y>250){
      rect(675-x/2,625-y,x,y);
    }else{
      rect(675-x/2,500-y/2,x,y);
    };
  };

  function drawFlavorText(flavorText){
    fill(255,255,255);
    textAlign("left");
    textSize(30);
    noStroke();
    text(flavorText[0],220,465);
    if(flavorText.length==2){
      text(flavorText[1],220,545);
    }
  }

  function getActText(){
    if(currentEnemyStats[2]<10){
      return ["Team - LV 17 ATK 3 DEF 18","He's angry now."]
    }else{
      return ["Team - LV 17 ATK 3 DEF 18","The birthday boy!"]
    }
  }
  function useItem(){
    itemlessBadge=0;
    if(itemCount>0){
      if(playerStats[4]==10){
        currentRunBadges[2]=1;
      }
      itemCount-=1;
      if(itemCount==0&&enemyPhase==1){
        currentRunBadges[3]=1
      }
      playerStats[4]+=10
      if(playerStats[4]>=20){
        playerStats[4]=20;
        return ["You ate Birthday Cake! You have "+String(itemCount)+" items left.","Your HP was maxed out."]
      }else{
        return ["You ate Birthday Cake! You have "+String(itemCount)+" items left.","You gained 10 HP."]
      }
    }else{
      return ["But there was no more cake."]
    }
  }

  function getFlavorText(){
    if(currentEnemyStats[2]<10){
      if(turnsInPhase==1){
        return ["His mask falls.","Keep going."]
      }else if(Math.random()<1/4){
        return ["Team's friends step back to avoid getting hit."]
      }else if(Math.random()<1/3){
        return ["Team says you have the IQ of a peanut. =)"]
      }else if(Math.random()<1/2){
        return ["Team spins his knife, waiting for your next attack."]
      }else{
        return ["Team asks if you're really trying to hurt him."]
      }
    }else{
      if(turnsInPhase==1){
        return ["It's Team's birthday!","He challenges you to a friendly duel."]
      }else if(Math.random()<1/4){
        return ["Team's friends gather to watch you."]
      }else if(Math.random()<1/3){
        return ["The sound of party poppers fills the air."]
      }else if(Math.random()<1/2){
        return ["Team looks at you, waiting for your next attack."]
      }else{
        return ["You see the cake being prepared for Team."]
      }
    }
  }
  function drawAttackBar(){
    strokeWeight(5);
    stroke(0,200,0);
    fill(0,255,0);
    beginShape();
    vertex(275,500);
    vertex(675,410);
    vertex(1075,500);
    vertex(675,590);
    vertex(275,500);
    endShape();
    stroke(100,0,200);
    fill(128,0,255);
    beginShape();
    vertex(675,420);
    vertex(715,500);
    vertex(675,580);
    vertex(635,500);
    vertex(675,420);
    endShape();
    beginShape();
    vertex(875,460);
    vertex(895,500);
    vertex(875,540);
    vertex(855,500);
    vertex(875,460);
    endShape();
    beginShape();
    vertex(475,460);
    vertex(495,500);
    vertex(475,540);
    vertex(455,500);
    vertex(475,460);
    endShape();
    line(720,430,755,500);
    line(720,570,755,500);
    line(630,430,595,500);
    line(630,570,595,500);
    line(900,470,915,500);
    line(900,530,915,500);
    line(450,470,435,500);
    line(450,530,435,500);
    noStroke();
    fill(255,255,255);
    rect(670+attackBarPos,410,10,180);
  };

  function numberToRarity(number){
    if(number==1){
      return "Common"
    }else if(number==2){
      return "Uncommon"
    }else if(number==3){
      return "Rare"
    }else if(number==4){
      return "Epic"
    }else if(number==5){
      return "Legendary"
    }
  }

  function drawEnemy(shake){
    imageMode(CENTER);
    if(fightTurn==2){
      tint(255,255,255,128)
    }
    if(enemySprite==2||enemySprite==3){
      image(spriteList[enemySprite],675+shake*(Math.random()*2-1),208+shake*(Math.random()*2-1),300,300)
    }else{
      image(spriteList[enemySprite],675+shake*(Math.random()*2-1),200+shake*(Math.random()*2-1),300,300)
    }
    noTint();
  }

  function startEnemyTurn(){
    chooseBossAttack();
    fightTurn=2;
    timer=currentBossAttack[0][2];
    heartPos=[0,0]
    offset=[675,500]
    if(currentBossAttack[0][1]>250){
      offset[1]-=(currentBossAttack[0][1]-250)/2
    };
    if(currentEnemyStats[2]<=10&&enemyPhase==1){
      enemyPhase=2;
      fightTurn=3;
      songList[1].stop()
      songList[0].stop()
      timer=300;
    }
  }

  flavorText=getFlavorText()
  draw = function() {
    if((currentEnemyStats[2]<=0||playerStats[4]<=0)&&menu!=4){
      menu=4;
      badgeSelection=0;
    }
    createCanvas(window.innerWidth-20,window.innerHeight-20);
    noSmooth();
    scale(min(window.innerWidth/1350,window.innerHeight/800));
    background(0,0,0);
    timedTrigger=(timer==1)
    timeSinceHit+=1;
    if(timer>0){
      timer-=1;
    };
    if(menu==2){
      drawButtons();
      drawStats();
      drawEnemy(shake);
      shake=Math.max(shake-1,0);
      if(fightTurn==1){
        drawBox(950,200);
        if(fightMenuDepth==1){
          drawFlavorText(flavorText);
          drawHeart(-190+325*fightMenuPosition[0],737.5);
        }else if(fightMenuDepth==3){
          if(timedTrigger){
            startEnemyTurn();
          }
          drawAttackBar();
          if(timer<70&&timer>55){
            drawSlash(675,200,3.5,(70-timer)/15);
          }
          if(timer<41&&timer>10){
            if(timer==40){
              shake=20;
            }
            drawDamageText(675,70,1,(40-timer)/30,currentHitDamage);
            if(timer>25){
              currentEnemyStats[2]-=currentHitDamage/15;
              currentEnemyStats[2]=max(currentEnemyStats[2],0);
            }
            drawEnemyHealthBar();
          }
          if(timer==0){
            attackBarPos+=15;
            if(attackBarPos>465){
              timer=75;
              playerAttacking=1;
              currentHitDamage=Math.round(10*((50/(50+Math.abs(attackBarPos)))*playerStats[2]*(1-currentEnemyStats[1]/25))*1.25*(1+Math.random()/5))/10;
              if(currentHitDamage>=1){
                weakBadge=0;
              }
              if(attackBarPos==0){
                framePerfectCombo+=1
                if(framePerfectCombo>=2){
                  currentRunBadges[6]=1;
                }
              }else{
                framePerfectCombo=0
              }
            }
          }
        }else if(fightMenuDepth==2&&fightMenuPosition[0]==2){
          drawFlavorText(getActText());
        }else if(fightMenuDepth==2&&fightMenuPosition[0]==3){
          drawFlavorText(itemText);
        }
      }else if(fightTurn==2){
        if(turnNum==1&&currentEnemyStats[2]>10){
          songList[0].loop()
        }
        if(timedTrigger){
          playerAttacking=0;
          fightTurn=1
          fightMenuDepth=1
          turnNum+=1
          turnsInPhase+=1
          flavorText=getFlavorText()
        }
        currentAttackTime=currentBossAttack[0][2]-timer
        drawBox(currentBossAttack[0][0],currentBossAttack[0][1])
        drawHeart(heartPos[0]+offset[0],heartPos[1]+offset[1]);
        playerMovement();
        createAttacks();
        drawAttacks();
        detectCollision();
        if(playerCollision&&timeSinceHit>50){
          takeDamage()
          timeSinceHit=0;
        }
      }else if(fightTurn==3){
        drawBox(950,200);
        if([200,170,140,110].includes(timer)){
          enemySprite+=1
        }else if (timer==80){
          for(var i=0;i<10;i++){
            maskParticles.push([20*Math.random()-10,20*Math.random()-10])
          }
          enemySprite=2
        }
        if(timer<80){
          for(var i=0;i<10;i++){
            temp=maskParticles[i]
            temp2=80-timer
            image(imageList[2],665+temp2*temp[0],220+temp2*(temp[1]+temp2*0.2),200,200);
          }
        }
        if(timer==0){
          enemySprite=3;
          songList[1].loop()
          chooseBossAttack();
          fightTurn=2;
          timer=currentBossAttack[0][2];
          heartPos=[0,0]
          offset=[675,500]
          if(currentBossAttack[0][1]>250){
            offset[1]-=(currentBossAttack[0][1]-250)/2
          };
          turnsInPhase=0;
        }
      }
    }else if(menu==4){
      if(currentEnemyStats[2]<=0){
        if(hitlessBadge==1){
          currentRunBadges[1]=1;
        }
        if(itemlessBadge==1){
          currentRunBadges[0]=1;
        }
        if(weakBadge==1){
          currentRunBadges[5]=1;
        }
        for(var i=0;i<currentRunBadges.length;i++){
          if(currentRunBadges[i]==1){
            noTint()
            /*if(badgeRarities[i]==1){
              tint(175,175,175)
            }else if(badgeRarities[i]==2){
              tint(70,200,70)
            }else if(badgeRarities[i]==3){
              tint(50,50,200)
            }else if(badgeRarities[i]==4){
              tint(100,0,200)
            }else if(badgeRarities[i]==5){
              tint(255,150,0)
            }*/
          }else{
            tint(40,40,40)
          }
          imageMode(CENTER)
          if(i==badgeSelection){
            //image(imageList[3],180*i+185,155,1200,1200)
            image(badgeList[i],180*i+180,150,180,180)
          }else{
            //image(imageList[3],180*i+180,150,800,800)
            image(badgeList[i],180*i+180,150,120,120)
          }
          noTint()
        }
        textAlign("left")
        fill(255,255,255)
        if(currentRunBadges[badgeSelection]==1){
          text("["+numberToRarity(badgeRarities[badgeSelection])+"] "+badgeDescriptions[badgeSelection],100,300)
        }else{
          text("You have not yet gotten this badge. Keep playing to unlock it!",100,300)
        }
        songList[1].stop()
        songList[0].stop()
        drawButtons();
        drawStats();
        drawBox(950,200);
        drawFlavorText(["You won! You earned 15000 EXP and 0 gold.","Your LOVE increased."]);
        textAlign("center");
        text("Press Z to play again. Badges persist through resets.",675,40)
        playerStats[0]=17;
      }else if(playerStats[4]<=0){
        songList[1].stop()
        songList[0].stop()
        textAlign("center");
        textSize(50)
        noStroke()
        fill(255,255,255)
        text("You lost. Press Z to try again!",675,300)
      }
    }
  };
};