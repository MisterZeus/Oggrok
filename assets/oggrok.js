"use strict";

//check if this browser supports various APIs we need

var us = "Unsupported APIs:";

if (!window.Blob) {
  us += "\n - Blob";
}
if (!window.File) {
  us += "\n - File";
}
if (!window.FileList) {
  us += "\n - FileList";
}
if (!window.FileReader) {
  us += "\n - FileReader";
}
if (!window.URL) {
  us += "\n - URL";
}

if (us != "Unsupported APIs:") {
  alert(us);
}
function OggPacket(version, typeFlags, granulePosition, streamSerial, pageNum, crcChecksum, numberOfSegments, segmentTable, payloads) {
  this.version = version;
  this.typeFlags = typeFlags;
  this.granulePosition = granulePosition;
  this.streamSerial = streamSerial;
  this.pageNum = pageNum;
  this.crcChecksum = crcChecksum;
  this.numberOfSegments = numberOfSegments;
  this.segmentTable = segmentTable;
  this.payloads = payloads;
}
function Uint8ArrayToHex(buf) {
  var hexEncodeArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  var arr = new Uint8Array(buf); //change our file object into a list of 8-bit integers
  var ret = '';
  for (var i = 0; i < arr.byteLength; i++) {
    var code = arr[i];
    ret += hexEncodeArray[code >>> 4]; //change the 4 Most Significant Bits into hex
    ret += hexEncodeArray[code & 0x0F]; //change the 4 Less Significant Bits into hex
    ret += " ";
  }
  var packets = ret.split(/4F 67 67 53/g); //"OggS" capture pattern
  if (packets[0] !== "") {
    console.log("Non-Ogg data found at beginning of file: " + packets[0]);
  };
  packets.shift();
  var versions = new Uint8Array(packets.slice(1, 1));
  return ret.replace(/4F 67 67 53/g, "</li><li>OggS").replace(/4F 70 75 73 48 65 61 64/g, "<br/>OpusHead");
}

function loadFiles(evnt) {
  document.getElementById("list").innerHTML = ""; //clear previously loaded files

  var files = evnt.target.files; //files is an array of File objects. List some properties
  console.log("# of files selected: ", files.length);

  //cycle through all files and add their details to the output tags
  var readers = [];
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var fileURL = window.URL.createObjectURL(f); //save file to a URL, to feed to audio tag source

    document.getElementById("list").innerHTML += ['<li><audio id="audio', i, '" controls src="', fileURL, '"></audio>', ' - <strong>', f.name, '</strong> (', f.type || "n/a", ') - ', f.size.toLocaleString(), ' bytes.', '<div id="header', i, '"></div></li>'].join('');

    if (files.length == 1) {
      (function () {
        var file = files[0],
            start = parseInt(0) || 0,
            stop = parseInt("eggs") || file.size - 1;

        readers[0] = new FileReader();

        readers[0].onloadend = function (evt) {
          //since we are using onloadend, we need to check the readyState === DONE
          if (evt.target.readyState === FileReader.DONE) {
            var byteCode = new Uint8Array();
            byteCode = evt.target.result;
            document.getElementById(["header", 0].join("")).innerHTML = ["Bytes ", start.toLocaleString(), " to ", stop.toLocaleString(), ":\n<ol>", Uint8ArrayToHex(byteCode).toString(), "</pre></li></ol>"].join("");
          }
        };

        readers[i].readAsArrayBuffer(file.slice(start, stop));
      })();
    }
  }
}

function readmultifiles(e) {
  var files = e.currentTarget.files;
  Object.keys(files).forEach(function (i) {
    var file = files[i];
    var reader = new FileReader();
    reader.onload = function (e) {
      //server call for uploading or reading the files one by one
      //by using 'reader.result' or 'file'
    };
    reader.readAsBinaryString(file);
  });
};

document.getElementById("files").addEventListener("change", loadFiles, false);