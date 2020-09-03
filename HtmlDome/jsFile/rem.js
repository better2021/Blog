;(function() {
  function SetRem() {
    var html = document.documentElement
    var hWidth = html.getBoundingClientRect().width
    var fz = hWidth / 7.5
    html.style.fontSize = fz <= 100 ? fz + 'px' : '100px'
  }
  SetRem()
  window.addEventListener('resize', SetRem)
})()
