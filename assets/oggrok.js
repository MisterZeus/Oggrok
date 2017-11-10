// check if this browser supports various APIs we need
var us = "Unsupported APIs:";

if(!window.Blob){us += "\n - Blob";}
if(!window.File){us += "\n - File";}
if(!window.FileList){us += "\n - FileList";}
if(!window.FileReader){us += "\n - FileReader";}
if(!window.URL){us += "\n - URL";}

if(us != "Unsupported APIs:"){alert(us);}

function handleFile(evnt) {
  var files = evnt.target.files;
  // files is an array of File objects. List some properties
  console.log("# of files selected: ",files.length);

  // cycle through all files and add their details to the output tags
  var output = [];
  for(var i=0,f;f=files[i];i++){
    // save file to a URL and feed to audio tag source
    var fileURL = window.URL.createObjectURL(f);
    output.push('<li><audio id="audio" controls src="',fileURL,'"></audio> - <strong>', f.name, '</strong> (', f.type || 'n/a', ') - ', f.size.toLocaleString(), ' bytes.</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

  var blob = files[0].slice(0,3);
  console.log(toString(blob));

  var blob2 = fileURL.slice(0,3);
  console.log(blob2);
}

document.getElementById('files').addEventListener('load', handleFile, false);
document.getElementById('files').addEventListener('change', handleFile, false);
