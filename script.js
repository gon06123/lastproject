const leaves = document.querySelectorAll('.leaf');
const leafSection = document.querySelector('.leaf-section');

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

// 스크롤 시 가로로 이동시키는 로직 (이전과 100% 동일합니다)
window.addEventListener('scroll', () => {
    const spacerTop = spacer.offsetTop;
    const spacerHeight = spacer.offsetHeight;
    const currentScroll = window.scrollY;
    const maxTranslate = track.scrollWidth - window.innerWidth;

    if (currentScroll >= spacerTop && currentScroll <= spacerTop + spacerHeight - window.innerHeight) {
        const progress = (currentScroll - spacerTop) / (spacerHeight - window.innerHeight);
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
    } else if (currentScroll < spacerTop) {
        track.style.transform = `translateX(0px)`;
    } else {
        track.style.transform = `translateX(-${maxTranslate}px)`;
    }
});






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
const rainSection = document.querySelector('.pt8'); // 해당 섹션
const rainOffset = rainSection.offsetTop;

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


