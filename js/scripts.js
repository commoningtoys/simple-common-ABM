const drag_bar = document.getElementById('drag-bar')
const data_viz_div = document.querySelector('.data-viz')
const expand_div = (e) => {
    let x = innerWidth - e.clientX
    if(x > innerWidth - 200) x = innerWidth - 200
    if(x < 200) x = 200
    drag_bar.style.right = (x-2) + 'px'
    data_viz_div.style.width = x + 'px'
}
drag_bar.onmousedown = (e) => {
    document.addEventListener('mousemove', expand_div)
}

document.onmouseup = (e) => {
    document.removeEventListener('mousemove', expand_div)
}

const change_alpha = (el) => {
    console.log(typeof el.value)
    // const viz_bg = document.querySelector('.data-viz')
    // data_viz_div.style.backdropFilter = `blur(${el.value}px)`
    data_viz_div.style.backgroundColor = `rgba(204, 204, 204, ${el.value})`
    // data_viz_div.setAttribute('style', `rgba(204, 204, 204, ${el.value})`)
}
