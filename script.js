async function toh (totalDiscs, source, destination, auxillary) {
  if(totalDiscs.length === 0) {
    return
  }
  const [largestDisc, ...remainingDisc] = totalDiscs
  await toh(remainingDisc, source, auxillary, destination)
  await sleep(1000)
  destination.prepend(largestDisc)
  await toh(remainingDisc, auxillary, destination, source)
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const towers = document.querySelectorAll('.disc-group')
const discs = document.querySelectorAll('.disc')
discs.forEach((disc, index) => {
  disc.innerHTML = index
  disc.style.backgroundColor = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  disc.style.width = `calc(100% * ${index + 1} / ${discs.length})`
})
toh([...discs].reverse(), towers[0], towers[2], towers[1])