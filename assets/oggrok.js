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

function Uint8ArrayToHex(buffer) {
  var arr = new Uint8Array(buffer); //change our file object into a list of 8-bit integers
  var hexEncodeArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  var ret = '';
  for (var i = 0; i < arr.byteLength; i++) {
    var code = arr[i];
    ret += hexEncodeArray[code >>> 4]; //change the 4 Most Significant Bits into hex
    ret += hexEncodeArray[code & 0x0F]; //change the 4 Less Significant Bits into hex
    ret += " ";
  }
  var packets = ret.split(/4F 67 67 53 /g); //"OggS" capture pattern
  if (packets[0] !== "") {
    console.log("WARNING: Non-Ogg data found at beginning of file: " + packets[0]);
  };
  packets.shift(); //remove first value: packets[0]
  var versions = [];
  var typeFlags = [];
  var granulePositions = [];
  var streamSerials = [];
  var pageNumbers = [];
  packets.forEach(function(packet, i){
    versions[i] = packet.slice(0, 2);
    typeFlags[i] = packet.slice(3, 5);
    granulePositions[i] = packet.slice(6, 29);
    streamSerials[i] = packet.slice(30, 41);
    pageNumbers[i] = packet.slice(42, 53);
  });
  console.log(versions);
  console.log(typeFlags);
  console.log(granulePositions);
  console.log(streamSerials);
  console.log(pageNumbers);
  return ret.replace(/4F 67 67 53/g, "</li><li>O  g  g  S ").replace(/4F 70 75 73 48 65 61 64/g, "<br/>O  p  u  s  H  e  a  d ").replace(/4F 70 75 73 54 61 67 73/g, "<br/>O  p  u  s  T  a  g  s ");
}

function parseFile(fileIn) {
  (function () {
    var file = fileIn, start = parseInt(0) || 0, stop = parseInt("eggs") || file.size - 1;
    var reader = new FileReader();
    reader.onloadend = function (evt) {
      //since we are using onloadend, we need to check the readyState === DONE
      if (evt.target.readyState === FileReader.DONE) {
        var byteCode = new Uint8Array();
        byteCode = evt.target.result;
        var packetsList = ["Bytes ", start.toLocaleString(), " to ", stop.toLocaleString(), ":"].join("");
        packetsList += [";\n<ol>", Uint8ArrayToHex(byteCode).toString(), "</pre></li></ol>"].join("");
        document.getElementById(["header", 0].join("")).innerHTML = packetsList;
      }
    };
    reader.readAsArrayBuffer(file.slice(start, stop));
  })();
}

function loadFiles(evnt) {
  var files = evnt.target.files; //files is an array of File objects

  document.getElementById("list").innerHTML = ""; //clear previously loaded files

  for (var i = 0; i < files.length; i++) {//cycle through all files and add them to the output list
    var f = files[i];
    var fileURL = window.URL.createObjectURL(f); //save file to a URL, to feed to audio tag source

    document.getElementById("list").innerHTML += ['<li><audio id="audio', i, '" controls src="', fileURL, '"></audio>', ' - <strong>', f.name, '</strong> (', f.type || "n/a", ') - ', f.size.toLocaleString(), ' bytes.', '<div id="header', i, '"></div></li>'].join('');

    if (files.length == 1) {
      parseFile(files[0]);
    }
  }
}
/*
function readmultifiles(e) {
  var files = e.currentTarget.files;
  Object.keys(files).forEach(function (i) {
    var file = files[i];
    var reader = new FileReader();
    reader.onload = function (e) {
      //server call for uploading or reading the files one by one by using 'reader.result' or 'file'
    };
    reader.readAsBinaryString(file);
  });
};
*/
document.getElementById("files").addEventListener("change", loadFiles, false);
