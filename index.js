import str2gbk from './gbk.js';
import str2big5 from './big5.js';

function getOutput(fromBig5) {
  const str = document.getElementById("input1").value;
  let conv = '';
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
