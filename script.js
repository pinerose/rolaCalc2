const selector = input => document.querySelector(input);
const selectorA = input => document.querySelectorAll(input);
const fselector = input => form.querySelector(input);

let variables = 
{
	damageMultiplier : 0,
	additionalDamage : 0,

	additionalDamageForSecond : 0,

	reflectionMultiplier : 0,
	additionalReflection : 0,

	defenseMultiplier : 0,
	additionalDefense : 0
}

let artifacts = 
{
	normal : 
	{
		단검 : {desc : "가장 가까이 있는 대상에게 5의 추가피해를 입힙니다. 가장 가까이 있는 대상에게 스킬을 사용할 경우에만 선택해주세요."},
		표주박 : {desc : "방어도를 가지고 있지 않을 경우 방어도를 추가로 30% 더 얻는 효과입니다. 방어도를 가지고 있지 않은 상황에서 스킬을 사용하는 상황일 때에만 적용해주세요."},
		화살촉 : {desc : "가장 체력이 적은 대상에게 4의 추가피해를 입힙니다. 체력이 제일 적은 대상에게 공격할 경우에만 사용해주세요."},
		숟가락 : {desc : "다음 100회의 타격동안 데미지가 2 감소하는 효과입니다. 스탯이 0이 되었을 경우 비활성화해 주세요."}
	},
	uncommon : 
	{
		/* 닻 : {desc : "현재 인게임 버그로 잘 작동하지 않는 유물입니다. 이거 끼면 치명타가 안터지니 그냥 잠그세요."}, */
		/* 선인장 : {desc : "동료가 없다면 획득 방어도의 30%만큼 반격을 얻는 유물입니다."} */
	},
	rare : 
	{
		증폭돌 : {desc : "과부하된 스킬을 사용할 경우 데미지가 100%p 증가하는 유물입니다. 스킬이 과부하된 상황에만 선택해주세요."}
	},
	unique : 
	{
		건틀릿 : {desc : "특정 공격 스킬의 데미지를 2배로 만들고 과부하시키는 유물입니다. 선택하려는 스킬이 이 유물의 효과로 인해 과부하된 경우에만 선택해주세요."}
	}
}

for (let x in artifacts) 
{
	for (let y in artifacts[x]) 
	{
		artifacts[x][y].selected = false;
	}
}

let job = ''
let comboValue = 0
let sharpnessValue = 0
let focusValue = 0
let woundValue = 0
let attackValue = 0
let enhanceBuff = ''
let superEnhanceBuff = ''
let frenzyBuff = ''
let criticalHit = ''
let defenselessDebuff = ''
let enemyFrenzyBuff = ''
let awakeningBuff = ''
let disgustDebuff = ''
let faintingDebuff = ''
let defenseValue = 0
let armorBuff = ''
let lethargyDebuff = ''


const form = selector('#calculator-form');

form.addEventListener('submit', (event) => {
	event.preventDefault();

	// 폼 데이터 가져오기
    job = form.querySelector('#job').value;

    comboValue = parseInt(form.querySelector('#stat-combo-value').value);
    sharpnessValue = parseInt(form.querySelector('#stat-sharpness-value').value);
    focusValue = parseInt(form.querySelector('#stat-focus-value').value);
    woundValue = parseInt(fselector('#stat-wound-value').value);

    attackValue = parseInt(form.querySelector('#stat-attack-value').value);
    enhanceBuff = form.querySelector('#enhance-buff').checked;
    superEnhanceBuff = form.querySelector('#super-enhance-buff').checked;
    frenzyBuff = form.querySelector('#frenzy-buff').checked;
    criticalHit = form.querySelector('#critical-hit').checked;
    defenselessDebuff = form.querySelector('#defenseless-debuff').checked;
    enemyFrenzyBuff = form.querySelector('#enemy-frenzy-buff').checked;
    awakeningBuff = form.querySelector('#awakening-buff').checked;
    disgustDebuff = form.querySelector('#disgust-debuff').checked;
    faintingDebuff = fselector('#fainting-debuff').checked;

    defenseValue = parseInt(fselector('#stat-defense-value').value);
    armorBuff = fselector('#armor-buff').checked;
    lethargyDebuff = fselector('#lethargy-debuff').checked;

    // 계수 / 추뎀 계산
    variables.damageMultiplier = Number((1 + (0.1 * attackValue) + 
            (enhanceBuff ? 0.25 : 0) + 
            (superEnhanceBuff ? 0.5 : 0) + 
            (frenzyBuff ? 1 : 0) + 
            (criticalHit ? 0.5 : 0) + 
            (defenselessDebuff ? 0.33 : 0) + 
            (enemyFrenzyBuff ? 0.5 : 0) + 
            (awakeningBuff ? 0.5 : 0) - 
            (disgustDebuff ? 0.33 : 0) + 
            (faintingDebuff ? 0.5 : 0)).toFixed(2));

    variables.additionalDamage = (comboValue + sharpnessValue + focusValue + woundValue);

    variables.additionalDamageForSecond = (comboValue + sharpnessValue + woundValue);

    variables.reflectionMultiplier = Number((1 + (0.1 * attackValue) + 
            (enhanceBuff ? 0.25 : 0) + 
            (superEnhanceBuff ? 0.5 : 0) + 
            (frenzyBuff ? 1 : 0) + 
            (criticalHit ? 0.5 : 0) + 
            (awakeningBuff ? 0.5 : 0) - 
            (disgustDebuff ? 0.33 : 0)).toFixed(2));

    variables.additionalReflection = (comboValue + sharpnessValue);

    variables.defenseMultiplier = Number((1 + (0.1 * defenseValue) + 
    	(awakeningBuff ? 0.5 : 0) -
    	(lethargyDebuff ? 0.33 : 0)).toFixed(2));

    variables.additionalDefense = (armorBuff ? 7 : 0);

    for (let x in classes)
    {
    	for (let y in classes[x])
    	{
    		for (let z in classes[x][y])
    		{
    			classes[x][y][z].mindmg = classes[x][y][z].baseMindmg;
    			classes[x][y][z].maxdmg = classes[x][y][z].baseMaxdmg;
    			classes[x][y][z].reflection = classes[x][y][z].baseReflection;
    			classes[x][y][z].defense = classes[x][y][z].baseDefense;
    			classes[x][y][z].secondMindmg = classes[x][y][z].baseSecondMindmg;
    			classes[x][y][z].secondMaxdmg = classes[x][y][z].baseSecondMaxdmg;
    			classes[x][y][z].otherdefense = classes[x][y][z].baseOtherdefense;

    			classes[x][y][z].mindmg = Math.floor(((classes[x][y][z].mindmg + variables.additionalDamage) * variables.damageMultiplier).toFixed(2));
    			classes[x][y][z].maxdmg = Math.floor(((classes[x][y][z].maxdmg + variables.additionalDamage) * variables.damageMultiplier).toFixed(2));
    			classes[x][y][z].reflection = Math.floor(((classes[x][y][z].reflection + variables.additionalReflection) * variables.reflectionMultiplier).toFixed(2));
    			classes[x][y][z].defense = Math.floor(((classes[x][y][z].defense + variables.additionalDefense) * variables.defenseMultiplier).toFixed(2));
    			classes[x][y][z].otherdefense = Math.floor(((classes[x][y][z].otherdefense + variables.additionalDefense) * variables.defenseMultiplier).toFixed(2));
    			classes[x][y][z].secondMindmg = Math.floor(((classes[x][y][z].secondMindmg + variables.additionalDamageForSecond) * variables.damageMultiplier).toFixed(2));
    			classes[x][y][z].secondMaxdmg = Math.floor(((classes[x][y][z].secondMaxdmg + variables.additionalDamageForSecond) * variables.damageMultiplier).toFixed(2));
    			switch (classes[x][y][z].skillname)
    			{
    			case '경계 태세':
    				classes[x][y][z].reflection = classes[x][y][z].baseReflection;

    				classes[x][y][z].reflection = Math.floor(((classes[x][y][z].reflection + variables.additionalReflection + comboValue) * variables.reflectionMultiplier).toFixed(2));
    				break;
    			case '회전방어':
    				classes[x][y][z].defense = classes[x][y][z].baseDefense;

    				classes[x][y][z].defense = Math.floor(((classes[x][y][z].defense + variables.additionalDefense + comboValue) * variables.defenseMultiplier).toFixed(2));
    				break;
    			case '혼신의 일격':
    				classes[x][y][z].mindmg = classes[x][y][z].baseMindmg;
    				classes[x][y][z].maxdmg = classes[x][y][z].baseMaxdmg;

    				classes[x][y][z].mindmg = Math.floor(((classes[x][y][z].mindmg + variables.additionalDamage + comboValue * 5) * variables.damageMultiplier).toFixed(2));
    				classes[x][y][z].maxdmg = Math.floor(((classes[x][y][z].maxdmg + variables.additionalDamage + comboValue * 5) * variables.damageMultiplier).toFixed(2));
    				break;
    			}
    		}
    	}
    }
});


function Skills(charClass, skillname, mindmg, maxdmg, reflection, defense, descFunc, secondDmg, otherdefense) 
{
	this.charClass = charClass;
	this.skillname = skillname;
	this.mindmg = mindmg;
	this.baseMindmg = mindmg;
	this.maxdmg = maxdmg;
	this.baseMaxdmg = maxdmg;
	this.reflection = reflection;
	this.baseReflection = reflection;
	this.defense = defense;
	this.baseDefense = defense;
	this.secondMindmg = mindmg;
	this.baseSecondMindmg = mindmg;
	this.secondMaxdmg = maxdmg;
	this.baseSecondMaxdmg = maxdmg;
	this.otherdefense = otherdefense;
	this.baseOtherdefense = otherdefense;
	this.desc = descFunc;
}

// 워리어 스킬
let 횡베기 = new Skills('워리어', '횡베기', 6, 10, NaN, NaN, function() { return `적 전체에게 ${this.secondMindmg} ~ ${this.secondMaxdmg}의 피해를 입힙니다.`});
let 타오르는투지 = new Skills('워리어', '타오르는 투지', NaN, NaN, NaN, NaN, function() { return '적을 처치하면 1의 행동력을 돌려받습니다.'});
let 약점노리기 = new Skills('워리어', '약점 노리기', 12, 18, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해와 1의 출혈을 부여합니다. 사거리 2.`})
let 가드브레이크 = new Skills('워리어', '가드 브레이크', NaN, NaN, NaN, NaN, function() { return '공격으로 적의 방어도와 철갑을 모두 제거하면 <br> 해당 적에게 2의 무기력과 1의 무방비를 부여합니다.'})
let 카운터디펜스 = new Skills("워리어", '카운터 디펜스', NaN, NaN, 10, 18, function() { return `스스로에게 ${this.defense}의 방어도와 ${this.reflection}의 반격을 부여합니다.`})
let 침착한대응 = new Skills("워리어", '침착한 대응', NaN, NaN, NaN, NaN, function() { return '방어력과 철갑을 모두 잃으면 1의 방어력을 얻습니다.'})
let 전력방어 = new Skills("워리어", '전력방어', NaN, NaN, NaN, 50, function() { return `1의 공격력과 ${this.defense}의 방어도를 얻고 1의 방어력을 잃습니다.`})
let 데들리스트라이크 = new Skills("워리어", '데들리 스트라이크', 48, 56, NaN, NaN, function() { return `최전방 적에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입힙니다.<br> 이 스킬로 적을 처치하면 1의 행동력을 추가로 돌려받습니다.`});
let 전투회복 = new Skills("워리어", '전투회복', NaN, NaN, NaN, NaN, function() { return '전투가 끝나면 모든 아군이 12%의 체력을 회복합니다.'});
let 악식 = new Skills("워리어", '악식', 10, 14, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입힙니다. <br> 이 스킬로 적을 처치하면 10의 체력을 회복합니다. 사거리 2.`})
let 생존기술 = new Skills("워리어", '생존 기술', NaN, NaN, NaN, NaN, function() { return '플레이어가 영구적으로 공격력 1, 최대 체력 10, 면역 1을 얻습니다.'});
let 포식 = new Skills("워리어", '포식', 12, 16, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입힙니다. <br> 이 스킬로 적을 처치하면 1sp를 얻습니다. 사거리 2.`})
let 공격 = new Skills("워리어", '공격', 11, 13, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입힙니다. 사거리 3.`})
let 방어 = new Skills("워리어", '방어', NaN, NaN, NaN, 8, function() { return `스스로 ${this.defense}의 방어도를 얻습니다.`})
let 더블슬래시 = new Skills("워리어", '더블 슬래시', 10, 16, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 1번, <br> ${this.secondMindmg} ~ ${this.secondMaxdmg}의 피해를 1번 입힙니다. 사거리 2.`})

// 나이트 스킬

/*let 수호집중 = new Skills('나이트', '', '', '', '', ``);
let 단호한응징 = new Skills('나이트', , , , , ``);
let 요새화 = new Skills('나이트', , , , , ``);
let 철통방어 = new Skills('나이트', , , , , ``);
let 포인트가드 = new Skills('나이트', , , , , ``);
let 의지단결 = new Skills('나이트', , , , , ``);
let 수비진형 = new Skills('나이트', , , , , ``);
let 티탄즈배리어 = new Skills('나이트', , , , , ``);
let 전진방어 = new Skills('나이트', , , , , ``);
let 위기극복 = new Skills('나이트', , , , , ``);
let 명예로운결투 = new Skills('나이트', , , , , ``);
let 타워실드 = new Skills('나이트', , , , , ``);
let 실드태클 = new Skills('나이트', , , , , ``);
let 방패술훈련 = new Skills('나이트', , , , , ``);
let 분쇄 = new Skills('나이트', 0, 0, NaN, this.mindmg, `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입히고 ${this.defense} ~ ${this.otherdefense}의 방어도를 획득합니다.`, , this.maxdmg);
let 거인사냥 = new Skills('나이트', , , , , ``); */

// let = new Skills('', , , , , ``);

// 랜서 스킬
let 몸풀기 = new Skills('랜서', '몸풀기', NaN, NaN, NaN, NaN, function() { return `즉시 2의 행동력과 2의 무방비를 얻습니다.`});
let 급소찌르기 = new Skills('랜서', '급소 찌르기', 16, 24, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입히고 2의 심한 출혈을 부여합니다. 사거리 2.`});
let 경계태세 = new Skills('랜서', '경계 태세', NaN, NaN, 10, 20, function() { return `스스로 ${this.defense}의 방어도와 ${this.reflection}의 반격을 얻습니다.`});
let 방세전환 = new Skills('랜서', '방세 전환', NaN, NaN, NaN, 50, function() { return `스스로 2의 공격력과 ${this.defense}의 방어도를 얻고 1의 방어력을 잃습니다.`});
let 트리플스탭 = new Skills('랜서', '트리플 스탭', 5, 9, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 1번, <br> ${this.secondMindmg} ~ ${this.secondMaxdmg}의 피해를 2번 입힙니다. 사거리 2.`});
let 깊이찌르기 = new Skills('랜서', '깊이 찌르기', 18, 26, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입힙니다. <br> 바로 뒤 적도 같은 피해를 입습니다. 사거리 2.`});
let 준비만전 = new Skills('랜서', '준비 만전', NaN, NaN, NaN, NaN, function() { return `전투 시작 시 3의 연참을 얻습니다.`});
let 사우전드드롭스 = new Skills('랜서', '사우전드 드롭스', 16, 24, NaN, NaN, function() { return `적 전체에게 ${this.secondMindmg} ~ ${this.secondMaxdmg}의 피해를 3번 입힙니다. <br> 전투당 1회 사용 가능합니다.`});
let 전진찌르기 = new Skills('랜서', '전진 찌르기', 10, 14, NaN, 10, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입히고 ${this.defense}의 방어도를 얻습니다. 사거리 2.`});
let 정면돌파 = new Skills('랜서', '정면돌파', NaN, NaN, NaN, NaN, function() { return `플레이어가 전방으로 이동하면 1의 강화를 얻습니다.`});
let 투창 = new Skills('랜서', '투창', 6, 8, NaN, NaN, function() { return `단일 적 대상에게 ${this.mindmg} ~ ${this.maxdmg} + 거리 * ${this.mindmg}의 피해를 입힙니다. <br> 사거리 무제한.`}, 6);
let 아크로바틱 = new Skills('랜서', '아크로바틱', NaN, NaN, NaN, 10, function() { return `플레이어가 자신의 턴에 이동할 때마다 ${this.defense}의 방어도를 얻습니다.`});
let 회전방어 = new Skills('랜서', '회전방어', NaN, NaN, NaN, 8, function() { return `스스로 ${this.defense}의 방어도를 얻습니다.`});
let 발경 = new Skills('랜서', '발경', 12, 18, NaN, NaN, function() { return `최전방의 적에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입히고 최후방으로 밀어냅니다. <br> 해당 스킬은 확정적으로 치명타가 터집니다. 치명타 체크란을 채웠는지 확인해주세요.`});
let 약점강타 = new Skills('랜서', '약점 강타', NaN, NaN, NaN, NaN, function() { return `적에게 치명타 피해를 입힐 때 1의 기절을 같이 부여합니다.`});
let 혼신의일격 = new Skills('랜서', '혼신의 일격', 16, 24, NaN, NaN, function() { return `앞으로 1칸 이동한 뒤 최전방 적에게 ${this.mindmg} ~ ${this.maxdmg}의 피해를 입히고 모든 연참을 소모합니다. <br> 이동 불가 상태일 때에도 사용 가능합니다.`});


let classes = 
{
	warrior : 
	{
		워리어 : 
		[
			횡베기, 타오르는투지, 약점노리기, 가드브레이크, 
			카운터디펜스, 침착한대응, 전력방어, 데들리스트라이크, 
			전투회복, 악식, 생존기술, 포식, 
			공격, 방어, 더블슬래시
		],
		나이트 : 
		[
			/* 수호집중, 철통방어, 요새화, 단호한응징, 
			포인트가드, 의지단결, 수비진형, 티탄즈배리어, 
			전진방어, 위기극복, 명예로운결투, 타워실드, 
			실드태클, 방패술훈련, 분쇄, 거인사냥 */
		],
		랜서 : 
		[
			트리플스탭, 깊이찌르기, 준비만전, 사우전드드롭스, 
			전진찌르기, 정면돌파, 투창, 아크로바틱, 
			회전방어, 발경, 약점강타, 혼신의일격,
			몸풀기, 방세전환, 경계태세, 급소찌르기 
		],
		아크나이트 : {}, 
		팔라딘 : {},
		리퍼 : {},
		버서커 : {}
	},
	mage : 
	{
		메이지 : {},
		소서러 : {},
		마지스터 : {},
		아크메이지 : {},
		드루이드 : {},
		워록 : {},
		서머너 : {}
	}
}


const setInformation = input =>
{
	switch (input)
	{
	case 'characterStat':
		for (let x of selectorA('section#header > div'))
		{
			x.style.display = 'none';
		}
		selector('section#header form#calculator-form').style.display = 'flex';
		break;
	case 'artifact':
		for (let x of selectorA('section#header > *'))
		{
			x.style.display = 'none';
		}
		selector('section#header div#presentArtifact').style.display = 'flex';
		break;
	/*
	case 'item':
		for (let x of selectorA('section#header > *'))
		{
			x.style.display = 'none';
		}
		selector('section#header div#presentItem').style.display = 'flex';
		break;
	*/
	}
}

function selectArtifact(img) {

  let artifactName = img.id;
  let artifactGrade = img.src.split('/')[9]; // 집컴 기준, github에 올릴 시 파일 위치 바뀔 가능성 매우 높음.
  let artifact = artifacts[artifactGrade][artifactName];
  if (artifact.selected == false) {
    artifact.selected = true;
    img.style.filter = 'brightness(1)';
  } else {
    artifact.selected = false;
    img.style.filter = 'brightness(0.3)';
  }
}

const updateArtifactList = grade => {
  for (let x of selectorA('#artifactList > *')) {
    x.parentNode.removeChild(x);
  }
  for (let x in artifacts[grade]) {
    img = document.createElement("img");
    img.src = `pictures/artifacts/${grade}/${x}.png`;
    img.id = `${x}`;
    img.onclick = function() { selectArtifact(this) };
    /* img.hover = function() {ArtifactInformation(this)} */
    selector('#artifactList').appendChild(img);
    if (artifacts[grade][x].selected == false) {
      selector(`#${x}`).style.filter = 'brightness(0.3)';
    } else if (artifacts[grade][x].selected == true) {
      selector(`#${x}`).style.filter = 'brightness(1)';
    }
  }
}

const selectArtifactGrade = input => {
  switch (input) {
    case 'normal':
      updateArtifactList('normal');
      break;
    case 'uncommon':
      updateArtifactList('uncommon');
      break;
    case 'rare':
      updateArtifactList('rare');
      break;
    case 'unique':
      updateArtifactList('unique');
      break;
  }
}

const selectJob = input => {
	switch (input)
	{
	case 'warrior':
		for (let x of selectorA('#classList > *'))
		{
			x.parentNode.removeChild(x);
		}
		for (let x of selectorA('#skillList > *'))
		{
			x.parentNode.removeChild(x);
		}
		for (let x in classes[input])
		{
			li = document.createElement('li');
			li.innerHTML = `${x}`;
			li.id = `${x}`;
			li.onclick = function() {selectClass(this.id) };
			selector('#classList').appendChild(li);
		}
		break;
	case 'mage':
		for (let x of selectorA('#classList > *'))
		{
			x.parentNode.removeChild(x);
		}
		for (let x of selectorA('#skillList > *'))
		{
			x.parentNode.removeChild(x);
		}
		for (let x in classes[input])
		{
			li = document.createElement('li');
			li.innerHTML = `${x}`;
			li.id = `${x}`;
			li.onclick = function() { selectClass(this.id) };

			selector('#classList').appendChild(li);
		}
		break;
	}
}

const selectClass = input => 
{
	switch (input)
	{
	case '워리어':
		for (let x of selectorA('#skillList > *'))
		{
			x.parentNode.removeChild(x);
		}
		for (let x in classes.warrior[input])
		{
			img = document.createElement('img');
			img.src = `pictures/skills/warrior/${input}/${classes.warrior[input][x].skillname}.PNG`;
			img.id = classes.warrior[input][x].skillname;
			img.onclick = function() { selectSkill(this.id) };
			selector('#skillList').appendChild(img);
		}
		break;
	case '랜서':
		for (let x of selectorA('#skillList > *'))
		{
			x.parentNode.removeChild(x);
		}
		for (let x in classes.warrior[input])
		{
			img = document.createElement('img');
			img.src = `pictures/skills/warrior/${input}/${classes.warrior[input][x].skillname}.PNG`;
			img.id = classes.warrior[input][x].skillname;
			img.onclick = function() { selectSkill(this.id) };
			selector('#skillList').appendChild(img);
		}

	}
}
const selectSkill = input => {
    for (let x of selectorA('#skillDescription > *')) {
        x.parentNode.removeChild(x);
    }
    for (let x in classes) {
        for (let y in classes[x]) {
            for (let z in classes[x][y]) {
                if (input == classes[x][y][z].skillname) {
                    let name = document.createElement('span');
                    name.innerHTML = classes[x][y][z].skillname;
                    selector('#skillDescription').appendChild(name);

                    let desc = document.createElement('span');
                    desc.innerHTML = classes[x][y][z].desc();
                    selector('#skillDescription').appendChild(desc);
                    selector('#skillDescription').style.display = 'flex';
                }
            }
        }
    }
}