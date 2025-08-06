const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const animateDisc = async (disc, destination) => {
  const destClientRect = destination.getBoundingClientRect();
  const discClientRect = disc.getBoundingClientRect()
  const destXCenter = destClientRect.left  + (destination.offsetWidth / 2);
  const discXCenter = disc.getBoundingClientRect().left + (disc.offsetWidth / 2);
  const x = destXCenter - discXCenter;

  const moveY = destClientRect.top - discClientRect.top - 10;
  await sleep(1000)
  disc.style.transform = `translate3d(0, ${moveY}px, 0)`
  await sleep(1000)
  disc.style.transform = `translate3d(${x}px, ${moveY}px, 0)`
  await sleep(1000)

  const rodHeight = destination.offsetHeight;
  const discBottom = discClientRect.top + disc.offsetHeight;
  const rodBottom = destClientRect.top + rodHeight;
  const stackedHeight = destination.childElementCount * disc.offsetHeight;

  const landY = rodBottom - stackedHeight - discBottom - 1 // 1 px above exisitng disc
  
  disc.style.transform = `translate3d(${x}px, ${landY}px, 0)`
  await sleep(1000)
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

const init = () => {
  const numberOfDiscs = 5;
  const discs = Array.from({length: numberOfDiscs}, (n,index) => {
    const disc = document.createElement('span');
    disc.className = 'disc';
    disc.style.backgroundColor= "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
    disc.style.width = `calc(100% * ${index + 1} / ${numberOfDiscs})`;
    return disc
  })
  const discGroups = document.querySelectorAll('.disc-group')
  discGroups[0].append(...discs)
  toh([...discs].reverse(), discGroups[0], discGroups[2], discGroups[1])
}
init();