//check if this browser supports various APIs we need
var us = "Unsupported APIs:";

if(!window.Blob){us += "\n - Blob";}
if(!window.File){us += "\n - File";}
if(!window.FileList){us += "\n - FileList";}
if(!window.FileReader){us += "\n - FileReader";}
if(!window.URL){us += "\n - URL";}

if(us != "Unsupported APIs:"){alert(us);}

function loadFiles(evnt) {
  document.getElementById("list").innerHTML = ""; //clear previously loaded files

  const files = evnt.target.files; //files is an array of File objects. List some properties
  console.log("# of files selected: ",files.length);

  //cycle through all files and add their details to the output tags
  var readers = [];
  for(var i=0,f; f=files[i]; i++){
    //save file to a URL and feed to audio tag source
    const fileURL = window.URL.createObjectURL(f);

    document.getElementById("list").innerHTML += ['<li><audio id="audio',i,'" controls src="',fileURL,'"></audio>'
      ,' - <strong>', f.name, '</strong> (', f.type || "n/a", ') - ', f.size.toLocaleString(), ' bytes.'
      ,'<div id="header',i,'"></div></li>'].join('');

    if (files.length==1) {
      const file = files[0]
        ,start = parseInt(0) || 0
        ,stop = parseInt("eggs") || file.size - 1;

      readers[0] = new FileReader();

      //If we use onloadend, we need to check the readyState.
      readers[0].onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { //DONE == 2
          var byteCode = new Uint8Array();
          byteCode = evt.target.result//.replace(/OggS/g, "</pre></li><li><pre>OggS");
          document.getElementById(["header",0].join("")).innerHTML = ["Bytes ", start.toLocaleString(), " to ", stop.toLocaleString(),":\n<ol>",byteCode.toString(),"</pre></li></ol>"].join("");
        }
      };

      readers[i].readAsArrayBuffer(file.slice(start, stop));
    }
  }
}

function readmultifiles(e) {
  const files = e.currentTarget.files;
  Object.keys(files).forEach(i => {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      //server call for uploading or reading the files one by one
      //by using 'reader.result' or 'file'
    }
    reader.readAsBinaryString(file);
  })
};

document.getElementById("files").addEventListener("change", loadFiles, false);
