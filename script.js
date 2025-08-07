const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let animDurationMs = 500
const ANIMATION_STATUS = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
}
let animStatus = ANIMATION_STATUS.IDLE
const discCountInput = document.querySelector("#slider-input");

const animateDisc = async (disc, destination) => {
  const destClientRect = destination.getBoundingClientRect();
  const discClientRect = disc.getBoundingClientRect()
  const destXCenter = destClientRect.left  + (destination.offsetWidth / 2);
  const discXCenter = disc.getBoundingClientRect().left + (disc.offsetWidth / 2);
  const x = destXCenter - discXCenter;

  const moveY = destClientRect.top - discClientRect.top - 30;
  await sleep(animDurationMs)
  disc.style.transform = `translate3d(0, ${moveY}px, 0)`
  await sleep(animDurationMs)
  disc.style.transform = `translate3d(${x}px, ${moveY}px, 0)`
  await sleep(animDurationMs)

  const rodHeight = destination.offsetHeight;
  const discBottom = discClientRect.top + disc.offsetHeight;
  const rodBottom = destClientRect.top + rodHeight;
  const stackedHeight = destination.childElementCount * disc.offsetHeight;

  const landY = rodBottom - stackedHeight - discBottom - 1 // 1 px above exisitng disc
  
  disc.style.transform = `translate3d(${x}px, ${landY}px, 0)`
  await sleep(animDurationMs)
  disc.style.transform = ''
  destination.prepend(disc)
}

const toh = async (totalDiscs, source, destination, auxillary) => {
  if(totalDiscs.length === 0) {
    return
  }
  const [largestDisc, ...remainingDisc] = totalDiscs
  await toh(remainingDisc, source, auxillary, destination)
  await animateDisc(largestDisc, destination)
  await toh(remainingDisc, auxillary, destination, source)
}
const towerRods = document.querySelectorAll('.rod')

const setDiscs = (count) => {
  towerRods[0].innerHTML = ""
  const numberOfDiscs = Number(count);
  const discs = Array.from({length: numberOfDiscs}, (n,index) => {
    const disc = document.createElement('span');
    disc.className = 'disc';
    const widthPercent = ((index + 1) / (numberOfDiscs + 1)) * 100;
    disc.style.width = `${widthPercent}%`;
    disc.style.transitionDuration = `${animDurationMs}ms`
    return disc
  })
  towerRods[0].append(...discs)
  towerRods.forEach(towerRod => {
    towerRod.style.height = `${Math.max(200, numberOfDiscs * discs[0].offsetHeight + 100)}px`
  })
}

const init = () => {
  if(animStatus === ANIMATION_STATUS.IN_PROGRESS) {
    return 
  }
  animStatus = ANIMATION_STATUS.IN_PROGRESS;
  discCountInput.disabled = true;
  discCountInput.style.opacity = 0.2
  const discs = document.querySelectorAll('.disc');
  toh([...discs].reverse(), towerRods[0], towerRods[2], towerRods[1])
}

const controlTransitionDuration = (action) => {
  switch(action) {
    case 'increment': {
      animDurationMs = Math.min(animDurationMs + 50, 1000);
      console.log(animDurationMs)
      break;
    }
    case 'decrement': {
      animDurationMs = Math.max(animDurationMs - 50, 50);
        console.log(animDurationMs)
      break;
    }
  }
  transitionDurationValue.textContent = `${animDurationMs} ms`
  const discs = document.querySelectorAll('.disc');
  discs.forEach(disc => {
    disc.style.transitionDuration = `${animDurationMs}ms`
  })
}

const value = document.querySelector("#disc-value");
const startBtn = document.querySelector("#start");
value.textContent = discCountInput.value;
setDiscs(3);

discCountInput.addEventListener("input", (event) => {
  value.textContent = event.target.value;
  setDiscs(Number(event.target.value))
});

startBtn.addEventListener("click", () => {
  if(animStatus === ANIMATION_STATUS.IN_PROGRESS) {
    window.location.reload()
  } else {
    startBtn.textContent = "RESTART"
   init()
  }
});


const transitionDurationValue = document.querySelector("#transition-duration-value");
const transitionDurationBtns = document.querySelectorAll(".transition-duration-btn");
transitionDurationValue.textContent = `${animDurationMs} ms`
transitionDurationBtns[0].addEventListener("click", controlTransitionDuration.bind(this, 'decrement'));
transitionDurationBtns[1].addEventListener("click", controlTransitionDuration.bind(this, 'increment'));


