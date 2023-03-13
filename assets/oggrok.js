"use strict";

//check if this browser supports various APIs we need

const title = "Your browser cannot support these JavaScript APIs:";

let us = title;

if (!window.Blob) {us += "\n - Blob";}
if (!window.File) {us += "\n - File";}
if (!window.FileList) {us += "\n - FileList";}
if (!window.FileReader) {us += "\n - FileReader";}
if (!window.URL) {us += "\n - URL";}

if (us != title) {alert(us);}

// Prevent default behavior (Prevent file from being opened)
function dragOverHandler(ev) {ev.preventDefault();}

function dropHandler(ev) {
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === 'file') {
        const file = item.getAsFile();
        loadFile(i, file);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

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
    '0','1','2','3','4','5','6','7',
    '8','9','A','B','C','D','E','F'
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


function FilePickerHandler(evnt) {
  const selectedFiles = evnt.target.files; //files is an array of File objects

  if (selectedFiles.length == 0) {
    console.log("selectedFiles.length == 0");
    alert("No files selected. Please select a valid Ogg Opus file.");
  }
  else {
    loadFiles(selectedFiles)
  }
}

function loadFiles(selectedFiles){
    //clear any previously loaded files
    var fileListHtml = document.getElementById("list")
    fileListHtml.innerHTML = "";

    //cycle through all selected files and add them to the output list
    for (
      let fileIndex = 0;
      fileIndex < selectedFiles.length;
      fileIndex++
      )
    {

      const file = selectedFiles[fileIndex];

      // need this to convert Unix epoch integer into an actual date
      const fileDate = new Date(file.lastModified);

      const headerString = [
        '<li>'
      ,'<p>'
       ,'    <b>Name:</b> ', file.name
       ,'<br><b>Type:</b> ', file.type || "n/a"
       ,'<br><b>Size:</b> ', file.size.toLocaleString(), ' bytes'
       ,'<br><b>Date:</b> ', fileDate.toLocaleString()
       ,'</p>'

      ].join('');

      fileListHtml.innerHTML += headerString;

      const acceptedMimeTypes = [
        "audio/ogg"
       ,"video/ogg"
       ,"audio/opus"
       ,"audio/aac"
       ,"audio/mid"
       ,"audio/midi"
       ,"audio/x-midi"
       ,"audio/mpeg"
       ,"audio/wav"
       ,"audio/webm"
       ,"audio/3gpp"
       ,"audio/3gpp2"
       ];

      if (acceptedMimeTypes.includes(file.type)
      ) {
        //save file to a URL, to feed to audio tag source
        const fileURL = window.URL.createObjectURL(file);

        const audioTag = `<audio id="audio${fileIndex}" src="${fileURL}" controls></audio>`;

        fileListHtml.innerHTML += audioTag;
        fileListHtml.innerHTML += `<div id="header${fileIndex}"></div></li>`;
        
        loadFile (fileIndex, file);
      } else {
        console.log (`Not parsing file ${file.name} because its type is "${file.type}".`);
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
    const byteCode = new Uint8Array(evt.target.result);

    parseFile(fileIndex, byteCode);
  };

  reader.readAsArrayBuffer(file.slice(start, stop));
}

let readIndex = 0; // global

function readXbytesFromY(bytesToRead, byteSource) {
  const returnBytes = byteSource.slice(readIndex, readIndex + bytesToRead);
  readIndex += bytesToRead;
  return returnBytes;
}

function readBytesTillNext(stringToFind, byteSource) {
  let offset = 0;

  while (readIndex + offset + stringToFind.length < byteSource.length) {
    const readAheadBytes = byteSource.slice(
      readIndex + offset,
      readIndex + offset + stringToFind.length
      );

    const readAheadChars = new TextDecoder().decode(readAheadBytes);

    if (readAheadChars === stringToFind) {
      const returnBytes = byteSource.slice(
        readIndex,
        readIndex + offset
        );
      readIndex += offset;
      return returnBytes;
    } else{
      offset++;
    }
  }

  const returnBytes = byteSource.slice(
    readIndex,
    readIndex + offset
    );
  readIndex += offset;
  return returnBytes;
}

const OGGS_BYTES = `OggS`;

function parseFile (fileIndex, bytes) {
  readIndex = 0; //start at first byte of this file

  while (readIndex < bytes.length) {
  const magicBytes = readXbytesFromY(4, bytes);
  const fourCC = new TextDecoder().decode(magicBytes);

  if (fourCC !== OGGS_BYTES) {
    console.log(`Non-OggS data found:\n${magicBytes} ${fourCC}`);
    return;
  }

  const version         = readXbytesFromY( 2, bytes);
  const typeFlags       = readXbytesFromY( 2, bytes);
  const granulePosition = readXbytesFromY(16, bytes);
  const streamSerial    = readXbytesFromY( 8, bytes);
  const pageNumber      = readXbytesFromY( 8, bytes);
  const crcChecksum     = readXbytesFromY( 8, bytes);
  const pageSegments    = readXbytesFromY( 4, bytes);

  const pageData = readBytesTillNext(OGGS_BYTES, bytes);
  const pageChars = new TextDecoder().decode(pageData);

  let packetList = `<ol id="file${fileIndex}"/>`;

  document.getElementById(`header${fileIndex}`).innerHTML += packetList;

  let oggPacketString = "<pre>";

  oggPacketString += `Version: ${version}\n`;

  oggPacketString += `Type Flags: ${typeFlags}`;
  const typeFlagsInt = HexToInt(typeFlags);
  oggPacketString += (typeFlagsInt & 0x1 ? ` Continued packet` : ` Fresh packet`);
  oggPacketString += (typeFlagsInt & 0x2 ? `, first page` : ``);
  oggPacketString += (typeFlagsInt & 0x4 ? `, last page` : ``);
  oggPacketString += `\n`;

  oggPacketString += `Granule Position: ${granulePosition}\n`;
  oggPacketString += `Stream Serial: ${streamSerial}\n`;
  oggPacketString += `Page Number: ${pageNumber}\n`;
  oggPacketString += `CRC: ${crcChecksum}\n`;
  oggPacketString += `Segment: ${pageSegments}\n`;

  oggPacketString += `Page Data: ${pageChars}`;
  oggPacketString += `<\pre>`;

  document.getElementById(`file${fileIndex}`).innerHTML += oggPacketString;

  console.log(`oggVersions: ${version}`);
  console.log(`oggTypeFlags: ${typeFlags}`);
  console.log(`oggGranulePositions: ${granulePosition}`);
  console.log(`oggStreamSerials: ${streamSerial}`);
  console.log(`oggPageNumbers: ${pageNumber}`);
  console.log(`oggCrcChecksums: ${crcChecksum}`);
  console.log(`oggPageSegments: ${pageSegments}`);
  console.log(`oggPageData: ${pageChars}`);
  }
}

// main ^_^
document.getElementById("filePicker").addEventListener("change", FilePickerHandler, false);
