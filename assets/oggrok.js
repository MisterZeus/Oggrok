"use strict";

//check if this browser supports various APIs we need

const title = "Unsupported JavaScript APIs:";

let us = title;

if (!window.Blob) {us += "\n - Blob";}
if (!window.File) {us += "\n - File";}
if (!window.FileList) {us += "\n - FileList";}
if (!window.FileReader) {us += "\n - FileReader";}
if (!window.URL) {us += "\n - URL";}

if (us != title) {alert(us);}

function HexToInt (hexValue){
  return parseInt(`0x${hexValue}`);
}

function IntToHex (intValue){
  return parseHex(intValue);
}

function Uint8ArrayToHex(buffer) {
  //change our file object into a list of 8-bit integers
  let arr = new Uint8Array(buffer);

  const hexEncodeArray = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'
  ];

  let dataInHex = '';

  for (
    let i = 0;
    i < arr.byteLength;
    i++
    ) {
    let code = arr[i];

    dataInHex += hexEncodeArray[code >> 4]; // 4 Most Significant Bits into hex

    dataInHex += hexEncodeArray[code & 0x0F]; // 4 Less Significant Bits into hex
  }
  return dataInHex;
}


function loadFiles(evnt) {
  const selectedFiles = evnt.target.files; //files is an array of File objects

  if (selectedFiles.length == 0) {
    console.log("selectedFiles.length == 0");
    alert("No files selected. Please select a valid Ogg Opus file.");
  }
  else {
    //clear any previously loaded files
    document.getElementById("list").innerHTML = "";

    //cycle through all selected files and add them to the output list
    for (
      let fileIndex = 0;
      fileIndex < selectedFiles.length;
      fileIndex++
      )
    {

      const file = selectedFiles[fileIndex];

      // we need this to convert Unix epoch integer into an actual date
      const fileDate = new Date(file.lastModified);

      const headerString = [
        '<li>'
       ,'<p>Name: ', file.name, '</p>'
       ,'<p>Type: ', file.type || "n/a", '</p>'
       ,'<p>Size: ', file.size.toLocaleString(), ' bytes.</p>'
       ,'<p>Last Modified: ', fileDate.toLocaleString(), '</p>'
       ,`<div id="header${fileIndex}"></div>`
       ,'</li>'
      ].join('');

      document.getElementById("list").innerHTML += headerString;

      if ( file.type == "audio/ogg"
        || file.type == "video/ogg"
        || file.type == "audio/wav"
      ) {
        //save file to a URL, to feed to audio tag source
        const fileURL = window.URL.createObjectURL(file);

        const audioTag = `<audio id="audio${fileIndex}" src="${fileURL}" controls></audio>`;

        document.getElementById("list").innerHTML += audioTag;
      }

      if ( file.type == "audio/ogg"
        || file.type == "video/ogg"
        || file.type == "audio/wav"
      ) {
        loadFile (fileIndex, file);
      } else {
        console.log (`Not parsing file ${file.name} because its type is "${file.type}".`);
      }
    }
  }
}

function loadFile(fileIndex,fileIn) {
  let file = fileIn
    ,start = 0
    ,stop = file.size - 1;

  let reader = new FileReader();

  reader.onloadend = function(evt) {
    // Convert our file into an array of unsigned integer bytes
    let byteCode = new Uint8Array();
    byteCode = evt.target.result;

    parseFile(byteCode, fileIndex);
  };

  reader.readAsBinaryString(file.slice(start, stop));
}

let readIndex = 0; // global

function readXbytesFromY(bytesToRead, byteSource) {
  const returnBytes = byteSource.slice(readIndex, readIndex + bytesToRead);
  readIndex += bytesToRead;
  return returnBytes;
}

function parseFile (bytes, fileIndex) {
  const magicBytes = readXbytesFromY(4, bytes);

  if (magicBytes != 'OggS') {
    console.log(`Non-Ogg data found at start of file: "${magicBytes}"`);
    return;
  }

  const version         = readXbytesFromY( 2, bytes);
  const typeFlags       = readXbytesFromY( 2, bytes);
  const granulePosition = readXbytesFromY(16, bytes);
  const streamSerial    = readXbytesFromY( 8, bytes);
  const pageNumber      = readXbytesFromY( 8, bytes);
  const crcChecksum     = readXbytesFromY( 8, bytes);
  const pageSegments    = readXbytesFromY( 4, bytes);

  let packetList = `<ol id="F${fileIndex}P${i}"/>`;

  document.getElementById(`header${fileIndex}`).innerHTML += packetList;

  let oggPacketString = "<li>";

  oggPacketString += `Version: ${versions[i]}\n`;

  oggPacketString += `Type Flags: ${typeFlags[i]}`;
  const typeFlagsInt = HexToInt(typeFlags[i]);
  oggPacketString += (typeFlagsInt & 0x1 ? ` Continued packet` : ` Fresh packet`);
  oggPacketString += (typeFlagsInt & 0x2 ? `, first page` : ``);
  oggPacketString += (typeFlagsInt & 0x4 ? `, last page` : ``);
  oggPacketString += `\n`;

  oggPacketString += `Granule Position: ${granulePositions[i]}\n`;
  oggPacketString += `Stream Serial: ${streamSerials[i]}\n`;
  oggPacketString += `Page Number: ${pageNumbers[i]}\n`;
  oggPacketString += `CRC: ${crcChecksums[i]}\n`;
  oggPacketString += `Segment: ${pageSegments[i]}\n`;

  oggPacketString.replace(/4F70757348656164/g, "<br/>O p u s H e a d ");
  oggPacketString.replace(/4F70757354616773/g, "<br/>O p u s T a g s ");

  document.getElementById(`F${fileIndex}P${i}`).innerHTML += oggPacketString;

  console.log(`oggVersions: ${versions}`);
  console.log(`oggTypeFlags: ${typeFlags}`);
  console.log(`oggGranulePositions: ${granulePositions}`);
  console.log(`oggStreamSerials: ${streamSerials}`);
  console.log(`oggPageNumbers: ${pageNumbers}`);
  console.log(`oggCrcChecksums: ${crcChecksums}`);
  console.log(`oggPageSegments: ${pageSegments}`);
}

// main ^_^
document.getElementById("filePicker").addEventListener("change", loadFiles, false);
