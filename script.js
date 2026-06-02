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


