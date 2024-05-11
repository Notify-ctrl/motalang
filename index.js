import str2gbk from './gbk.js';
import str2big5 from './big5.js';
import simp2trad from './simptradconv.js';

function getOutput(fromBig5) {
  let str = document.getElementById("input1").value;
  let conv = document.getElementById("convCheck").checked;
  if (conv) str = simp2trad(str, true);
  if (fromBig5) {
    const buf = str2big5(str);
    conv = new TextDecoder('gbk').decode(buf);
  } else {
    const buf = str2gbk(str);
    conv = new TextDecoder('big5').decode(buf);
  }

  return conv;
}

document.getElementById("input1").oninput = () => {
  document.getElementById("big5out").textContent = getOutput(true);
  document.getElementById("gbkout").textContent = getOutput(false);
}

window.onresize = () => {
  const oritentation = (window.innerWidth > window.innerHeight) ? "landscape":"portrait";
  const div = document.getElementById("outdiv");

  if(oritentation === 'portrait'){
    div.setAttribute('style', 'display:default');
  } else {
    div.setAttribute('style', 'display:flex');
  }
};

window.onresize()
