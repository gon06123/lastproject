const leaves = document.querySelectorAll('.leaf');
const leafSection = document.querySelector('.leaf-section');

// ==========================================
// 전체 페이지 부드러운 세로 스크롤 (Lenis)
// ==========================================
const lenis = new Lenis({
    duration: 0.7, // 스크롤 부드러움 정도 (기본값 1.2)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 부드러운 감속 곡선
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ==========================================
// 기존 로직들
// ==========================================

let targetY = 0;
let currentY = 0;

// 해당 섹션이 문서 전체에서 어디쯤(Y좌표) 위치해 있는지 가져옵니다.
const sectionOffset = leafSection.offsetTop;

window.addEventListener('scroll', () => {
    // 핵심: 전체 스크롤 값에서 섹션의 시작 위치를 뺍니다.
    // 이렇게 하면 스크롤이 해당 섹션에 도달했을 때 애니메이션 기준점이 0에 맞춰집니다.
    targetY = window.scrollY - sectionOffset;
});

function animateLeaves() {
    currentY += (targetY - currentY) * 0.09; // 텐션 강도 조절 (0.08)

    leaves.forEach(leaf => {
        const speed = leaf.getAttribute('data-speed');

        // 이동 거리와 회전값 계산
        const moveY = currentY * speed;
        const rotateZ = currentY * speed * 0.1;

        leaf.style.transform = `translateY(${moveY}px) rotate(${rotateZ}deg)`;
    });

    requestAnimationFrame(animateLeaves);
}

animateLeaves();


// ==========================================
// 스크롤 박스 및 숫자 인터랙션 구역
// ==========================================
const container = document.querySelector('.scroll-container');
const box = document.getElementById('box');
const number = document.getElementById('number');
const desc = document.getElementById('desc');

let targetProgress = 0;  // 스크롤 위치에 따른 목표 진척도
let currentProgress = 0; // 부드럽게 쫓아가는 현재 진척도

// 이 섹션이 전체 문서의 상단으로부터 몇 px 떨어져 있는지 실시간 감지
const containerOffset = container.offsetTop;

window.addEventListener('scroll', () => {
    // 현재 스크롤에서 섹션의 시작점 위치를 빼서 기준점을 0px로 맞춤
    const scrollTop = window.scrollY - containerOffset;
    const maxScroll = container.offsetHeight - window.innerHeight;

    // 실제 스크롤 진행도 계산 (0 ~ 1)
    let rawProgress = scrollTop / maxScroll;

    // 안전장치: 섹션 진입 전엔 0, 완전히 지난 후엔 1로 락(Lock)
    if (rawProgress < 0) rawProgress = 0;
    if (rawProgress > 1) rawProgress = 1;

    // [여유시간 설정] 전체 스크롤의 70%(0.7) 시점에 애니메이션을 미리 끝냅니다.
    targetProgress = rawProgress / 0.7;

    if (targetProgress < 0) targetProgress = 0;
    if (targetProgress > 1) targetProgress = 1;
});

// 박스 애니메이션 엔진 루프
function animateBox() {
    // 감속 공식 (0.06 비율로 미끄러지듯 쫀득하게 이동)
    currentProgress += (targetProgress - currentProgress) * 0.09;

    // 1. 숫자 변경 (100% -> 8%)
    const currentNum = Math.round(100 - (currentProgress * (100 - 8)));
    number.innerText = `${currentNum}%`;

    // 2. 박스 크기 변경 (0% -> 92%)
    const currentBoxSize = currentProgress * 92;
    box.style.width = `${currentBoxSize}%`;


    // 3. 설명 박스 제어 (진행도가 후반부 80%를 넘어서면 스르륵 등장)
    if (currentProgress > 0.8) {
        const descProgress = (currentProgress - 0.8) / 0.2; // 0 ~ 1 비율 재계산
        const insetX = (1 - descProgress) * 50;
        desc.style.clipPath = `inset(0 ${insetX}% 0 ${insetX}%)`;
    } else {
        desc.style.clipPath = 'inset(0 50% 0 50%)';
    }

    // 브라우저 프레임 동기화 무한 루프
    requestAnimationFrame(animateBox);
}

// 박스 애니메이션 최초 실행
animateBox();


const steps = document.querySelectorAll('.shrink-js p');
const startSize = 3.5; // 시작 폰트 크기 (2.5rem)
const endSize = 1.0;   // 가장 작은 마지막 폰트 크기 (1.0rem)
const totalSteps = steps.length;

steps.forEach((el, index) => {
    // 인덱스에 따라 첫 단어부터 마지막 단어('를')까지 아주 일정하고 자연스럽게 줄어들도록 공식 적용
    const size = totalSteps > 1
        ? startSize - (index * (startSize - endSize) / (totalSteps - 1))
        : startSize;
    el.style.fontSize = `${size}rem`;
});



// pt5textbox4용 글자 크기 축소 로직 (수치 변경 가능)
const steps4 = document.querySelectorAll('.pt5textbox4 p');
const startSize4 = 0.9; // pt5textbox4 시작 폰트 크기 (원하시는 값으로 조정하세요)
const endSize4 = 0.3;   // pt5textbox4 마지막 폰트 크기 (원하시는 값으로 조정하세요)
const totalSteps4 = steps4.length;

steps4.forEach((el, index) => {
    const size = totalSteps4 > 1
        ? startSize4 - (index * (startSize4 - endSize4) / (totalSteps4 - 1))
        : startSize4;
    el.style.fontSize = `${size}rem`;
});





const spacer = document.getElementById('spacer');
const track = document.getElementById('track');

// 가로 길이에 맞춰 스크롤 여백(spacer) 높이 설정
function setHeight() {
    const scrollAmount = track.scrollWidth - window.innerWidth;
    spacer.style.height = `${window.innerHeight + scrollAmount}px`;
}

setHeight();
window.addEventListener('resize', setHeight);

let hzTargetX = 0;
let hzCurrentX = 0;

// 스크롤 시 가로로 이동시키는 로직 (부드러운 관성 추가)
window.addEventListener('scroll', () => {
    const spacerTop = spacer.offsetTop;
    const spacerHeight = spacer.offsetHeight;
    const currentScroll = window.scrollY;
    const maxTranslate = track.scrollWidth - window.innerWidth;

    if (currentScroll >= spacerTop && currentScroll <= spacerTop + spacerHeight - window.innerHeight) {
        const progress = (currentScroll - spacerTop) / (spacerHeight - window.innerHeight);
        hzTargetX = -(progress * maxTranslate);
    } else if (currentScroll < spacerTop) {
        hzTargetX = 0;
    } else {
        hzTargetX = -maxTranslate;
    }
});

function animateHorizontalScroll() {
    // 0.08의 비율로 부드럽게 목표 지점을 따라감 (숫자가 작을수록 더 미끄러짐)
    hzCurrentX += (hzTargetX - hzCurrentX) * 0.08;
    track.style.transform = `translateX(${hzCurrentX}px)`;

    // 가로 스크롤이 부드럽게 이동하는 매 프레임마다 텍스트 & 발자국 업데이트
    updateHorizontalTexts();
    updateFootprints();

    requestAnimationFrame(animateHorizontalScroll);
}

// ==========================================
// 발자국 스크롤 연동 나타나기
// ==========================================
const footprints = document.querySelectorAll('.scene div[class^="footstep"] img');

footprints.forEach(img => {
    img.style.opacity = '0';
});

function updateFootprints() {
    const triggerX = window.innerWidth * 0.7;

    footprints.forEach(img => {
        const rect = img.getBoundingClientRect();

        // 텍스트와 마찬가지로 X좌표 기준 + 같은 X좌표일 경우 위에서 아래로 켜지도록 Y좌표 가중치
        let charOffset = rect.left + (rect.top * 0.5);

        // 100px 구간 동안 부드럽게 투명도가 0 -> 1.0 으로 변함
        let opacity = (triggerX - charOffset) / 100;
        opacity = Math.max(0, Math.min(1, opacity));

        img.style.opacity = opacity;
    });
}

// ==========================================
// 가로 스크롤 파트 텍스트 한 글자씩 나타나기
// ==========================================
const hzTexts = document.querySelectorAll('.scroll-spacer .scene p');
const allChars = [];

hzTexts.forEach(p => {
    const text = p.textContent;
    p.innerHTML = '';

    for (let char of text) {
        if (char === ' ' || char === '\n' || char === '\t') {
            p.appendChild(document.createTextNode(char));
        } else {
            const span = document.createElement('span');
            span.innerText = char;
            span.style.opacity = '0'; // 안 보이다가 확 나타나도록 초기 0
            p.appendChild(span);
            allChars.push(span);
        }
    }
});

function updateHorizontalTexts() {
    // 화면의 70% 지점 (오른쪽에서 30% 들어온 위치)
    const triggerX = window.innerWidth * 0.7;

    let prevOffset = -Infinity;

    allChars.forEach(span => {
        const rect = span.getBoundingClientRect();

        // 기본 좌표 = X좌표 + (세로쓰기를 위한 Y좌표 가중치 0.5)
        let charOffset = rect.left + (rect.top * 0.5);

        // 📌 딜레이 해결: 
        // 물리적 위치가 뒤죽박죽(역순이거나 겹침)일 때만 최소 간격(15px)으로 순서를 보정합니다.
        // 간격이 너무 크면 뒤로 갈수록 눈덩이처럼 딜레이가 쌓이므로 15px로 타협했습니다.
        if (charOffset < prevOffset + 15) {
            charOffset = prevOffset + 15;
        }
        prevOffset = charOffset;

        // 100px 구간 동안 부드럽지만 텐션있게 투명도가 0 -> 1.0 으로 변함
        let opacity = (triggerX - charOffset) / 100;
        opacity = Math.max(0, Math.min(1, opacity));

        span.style.opacity = opacity;
    });
}

// ==========================================
// pt5-5 자동차 및 텍스트 밀어내기 인터랙션
// ==========================================
const pt55Section = document.querySelector('.pt5-5');
const yellowcar = document.querySelector('.yellowcar');
const movingtext3 = document.querySelector('.movingtext3');

let pt55Target = 0;
let pt55Current = 0;

window.addEventListener('scroll', () => {
    if (!pt55Section) return;
    const rect = pt55Section.getBoundingClientRect();

    // '일로와' 텍스트의 실제 Y위치
    const yPos = rect.top + 950;

    // 트리거 시점 대폭 앞당김: 텍스트가 화면 중앙에 도달하기 '전에' 이미 충돌이 일어나도록
    // 화면에 나타나기 직전(130%)부터 모션을 시작하고, 중앙(50%)보다 위인 40%에서 모션이 끝납니다.
    const startY = window.innerHeight * 1.3;
    const endY = window.innerHeight * 0.4;

    let progress = (startY - yPos) / (startY - endY);
    progress = Math.max(0, Math.min(1, progress));

    pt55Target = progress;
});

function animatePt55() {
    if (!pt55Section) return;
    pt55Current += (pt55Target - pt55Current) * 0.1;

    // 1. 차는 화면에 보이는 위치(200px)에서부터 달려와 왼쪽(-200px)까지 밀고 들어감
    // 너무 멀리(500px)서 출발하면 차가 보이지 않아 애니메이션이 늦게 시작되는 것처럼 느껴짐
    const carOffset = 200 - (400 * pt55Current);
    if (yellowcar) yellowcar.style.transform = `translateX(${carOffset}px)`;

    // 2. 물리적 충돌 계산: 차 이미지의 여백 등을 고려하여 텍스트가 먼저 움직이지 않도록
    // 차가 텍스트에 완전히 닿는 시점을 0.6으로 늦췄습니다.
    let hitProgress = (pt55Current - 0.6) / 0.4;
    hitProgress = Math.max(0, Math.min(1, hitProgress));

    // 텐션 강도를 낮춰서 당구공보다는 얼음판 위를 스르륵 미끄러지는 느낌의 완만한 곡선 적용
    const slideProgress = 1 - Math.pow(1 - hitProgress, 1.5);

    // '일', '로', '와' 글자들이 차에 맞고 미끄러짐
    const stairs = document.querySelectorAll('.stair');
    stairs.forEach((stair, index) => {
        let maxPush = 0;
        if (index === 0) maxPush = 100;
        else if (index === 1) maxPush = 600;
        else if (index === 2) maxPush = 1400;

        const pushAmount = maxPush * slideProgress;

        stair.style.display = 'inline-block';
        stair.style.transform = `translateY(${pushAmount}px)`;
    });

    requestAnimationFrame(animatePt55);
}
// 최초 실행
animatePt55();

// 가로 스크롤 + 텍스트 애니메이션 시작
animateHorizontalScroll();






// ==========================================
// pt6 이미지 순차 페이드인 인터랙션 (최종본)
// ==========================================
const pt6Section = document.querySelector('.pt6');
const pt6Images = document.querySelectorAll('.pt6img1 img');

let pt6TargetProgress = 0;
let pt6CurrentProgress = 0;

window.addEventListener('scroll', () => {
    const rect = pt6Section.getBoundingClientRect();
    const sectionHeight = pt6Section.offsetHeight;

    // [튜닝] startOffset: 화면의 80% 지점(하단)에서부터 이미지가 나타나기 시작함
    // 이 숫자를 키우면 더 빨리 시작하고, 줄이면 늦게 시작합니다.
    const startOffset = window.innerHeight * 0.7;

    // 섹션 내 스크롤 진행도 계산
    let progress = (-rect.top + startOffset) / (sectionHeight - window.innerHeight);

    // 0~1 사이로 고정
    pt6TargetProgress = Math.max(0, Math.min(1, progress));
});

function animatePt6() {
    // 1. 관성 효과 (0.15: 더 빠르게 쫓아오도록 조절됨)
    pt6CurrentProgress += (pt6TargetProgress - pt6CurrentProgress) * 0.05;

    // 2. 이미지들 순차 등장
    pt6Images.forEach((img, index) => {
        // [튜닝] index * 0.04: 각 이미지 간격 (작을수록 동시에 나타남)
        const startThreshold = index * 0.04;

        // [튜닝] * 20: 투명도가 0에서 1로 변하는 속도 (클수록 확 나타남)
        const opacity = Math.min(1, Math.max(0, (pt6CurrentProgress - startThreshold) * 8));

        img.style.opacity = opacity;
    });

    requestAnimationFrame(animatePt6);
}

// 애니메이션 실행
animatePt6();





// ==========================================
// 비 애니메이션 전용 로직 (분리됨)
// ==========================================
const rainElements = document.querySelectorAll('.rain');
const rainSection = document.querySelector('.pt7'); // HTML에서 pt8이 pt7로 변경됨
const rainOffset = rainSection ? rainSection.offsetTop : 0;

let rainTargetY = 0;
let rainCurrentY = 0;

window.addEventListener('scroll', () => {
    // 섹션 시작점 기준의 상대 스크롤 값 계산
    rainTargetY = window.scrollY - rainOffset;
});

function animateRain() {
    // 1. 부드러운 움직임 계산 (관성 적용)
    rainCurrentY += (rainTargetY - rainCurrentY) * 0.09;

    // 2. 비 요소들 이동
    rainElements.forEach(rain => {
        // 섹션 밖에서는 0으로 유지
        const relativeY = Math.max(0, rainCurrentY);
        const speed = rain.getAttribute('data-speed') || 0.1;

        rain.style.transform = `translateY(${relativeY * speed}px)`;
    });

    // 3. 루프 실행
    requestAnimationFrame(animateRain);
}

// 비 애니메이션 시작
animateRain();



// ==========================================
// fence 스크롤 연동 슬라이드인 (스크롤 올리면 다시 들어감)
// ==========================================
const fenceElements = document.querySelectorAll('.fence1, .fence2, .fence3');

let fenceTargets = [0, 0, 0];
let fenceCurrents = [0, 0, 0];

window.addEventListener('scroll', () => {
    fenceElements.forEach((fence, index) => {
        const rect = fence.getBoundingClientRect();

        // 화면 하단(90% 지점)에서 등장하기 시작해, 중간(40% 지점)쯤 완전히 들어옵니다.
        const startY = window.innerHeight * 0.9;
        const endY = window.innerHeight * 0.4;

        let progress = (startY - rect.top) / (startY - endY);
        // 0과 1 사이로 제한
        progress = Math.max(0, Math.min(1, progress));

        fenceTargets[index] = progress;
    });
});

function animateFence() {
    fenceElements.forEach((fence, index) => {
        // 부드럽게 따라가기 (관성)
        fenceCurrents[index] += (fenceTargets[index] - fenceCurrents[index]) * 0.05;

        let offset = 0;

        if (fence.classList.contains('fence2')) {
            // 오른쪽 2번 펜스: 더 먼 거리(+300px)에서 0px 로 이동
            const fence2Offset = 500;
            offset = fence2Offset * (1 - fenceCurrents[index]);
        } else {
            // 왼쪽 1, 3번 펜스: 기본 거리(-150px)에서 0px 로 이동
            const defaultOffset = 150;
            offset = -defaultOffset * (1 - fenceCurrents[index]);
        }

        fence.style.transform = `translateX(${offset}px)`;
    });

    requestAnimationFrame(animateFence);
}
// 최초 실행
animateFence();
