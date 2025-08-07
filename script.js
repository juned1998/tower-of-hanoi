const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const DELAY = 500
let animStatus = 'idle'
const animateDisc = async (disc, destination) => {
  const destClientRect = destination.getBoundingClientRect();
  const discClientRect = disc.getBoundingClientRect()
  const destXCenter = destClientRect.left  + (destination.offsetWidth / 2);
  const discXCenter = disc.getBoundingClientRect().left + (disc.offsetWidth / 2);
  const x = destXCenter - discXCenter;

  const moveY = destClientRect.top - discClientRect.top - 30;
  await sleep(DELAY)
  disc.style.transform = `translate3d(0, ${moveY}px, 0)`
  await sleep(DELAY)
  disc.style.transform = `translate3d(${x}px, ${moveY}px, 0)`
  await sleep(DELAY)

  const rodHeight = destination.offsetHeight;
  const discBottom = discClientRect.top + disc.offsetHeight;
  const rodBottom = destClientRect.top + rodHeight;
  const stackedHeight = destination.childElementCount * disc.offsetHeight;

  const landY = rodBottom - stackedHeight - discBottom - 1 // 1 px above exisitng disc
  
  disc.style.transform = `translate3d(${x}px, ${landY}px, 0)`
  await sleep(DELAY)
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
const init = (discValue) => {
  if(animStatus === 'in-progress') {
    return 
  }
  console.log(animStatus)
  animStatus = 'in-progress'
  const numberOfDiscs = Number(discValue);
  const discs = Array.from({length: numberOfDiscs}, (n,index) => {
    const disc = document.createElement('span');
    disc.className = 'disc';
    const widthPercent = ((index + 1) / (numberOfDiscs + 1)) * 100;
    disc.style.width = `${widthPercent}%`;
    return disc
  })
  towerRods[0].append(...discs)
  document.documentElement.style.setProperty('--tower-rod-height', `${numberOfDiscs * discs[0].offsetHeight + 100}px`);
  toh([...discs].reverse(), towerRods[0], towerRods[2], towerRods[1]).then(() => {
    animStatus = 'idle'
  })
}

const reset = () => {
    animStatus = 'idle'
  towerRods.forEach(t => {
    t.innerHTML = ""
  })
  const discs = document.querySelectorAll('.disc')
  discs.forEach(d => d.remove())
}

const value = document.querySelector("#disc-value");
const input = document.querySelector("#slider-input");
const startBtn = document.querySelector("#start");
value.textContent = input.value;

input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});

startBtn.addEventListener("click", () => {
  if(animStatus === 'in-progress') {
    window.location.reload()
  } else {
    startBtn.textContent = "Reset"
   init(input.value)
  }
});
