"use strict";

//check if this browser supports various APIs we need

let title = "Unsupported JavaScript APIs:";
let us = title;

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

if (us != title) {
  alert(us);
}

function HexToInt (hexValue){
  return parseInt(`0x${hexValue}`)
}

function Uint8ArrayToHex(buffer) {
  //change our file object into a list of 8-bit integers
  let arr = new Uint8Array(buffer);
  
  let hexEncodeArray = [
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

function parseFile(fileIndex,fileIn) {
  (function () {
    let file = fileIn
      ,start = parseInt(0) || 0
      ,stop = parseInt("eggs") || file.size - 1;

    let reader = new FileReader();

    reader.onloadend = function (evt) {
      // Since we are using onloadend,
      // we need to check the readyState === DONE
      if (evt.target.readyState === FileReader.DONE) {
        // Convert our file into an array of unsigned integer bytes
        let byteCode = new Uint8Array();
        byteCode = evt.target.result;
  
        // Convert our array of unsigned integer bytes into hex
        let dataInHexString = Uint8ArrayToHex(byteCode).toString();
        
        //split string at "OggS" capture pattern
        let oggPackets = dataInHexString.split(/4F676753/g);
        
        // Since we expect our file to start with "OggS"
        // and we are splitting on "OggS",
        // we should have an empty first element!
        if (oggPackets[0] !== "") {
          let fourCC = oggPackets[0].slice(0, 4);
      
          console.log(`Non-Ogg data found at beginning of file: "${fourCC}"`);
        }
        else {
          oggPackets.shift(); //remove first value: packets[0]
        };
      
        let versions = [];
        let typeFlags = [];
        let granulePositions = [];
        let streamSerials = [];
        let pageNumbers = [];
        let crcChecksums = [];
        let pageSegments = [];
      
        oggPackets.forEach(function(packet, i){
          versions[i]         = packet.slice( 0,  2);
          typeFlags[i]        = packet.slice( 2,  4);
          granulePositions[i] = packet.slice( 4, 20);
          streamSerials[i]    = packet.slice(20, 28);
          pageNumbers[i]      = packet.slice(28, 36);
          crcChecksums[i]     = packet.slice(36, 44);
          pageSegments[i]     = packet.slice(44, 46);
      
          let packetList = `<ol id="oggPacket${i}"/>`;

          document.getElementById(`header${fileIndex}`).innerHTML += packetList;

          let oggPacketString = "";

          oggPacketString += `<li>Version: ${versions[i]}</li>`;

          oggPacketString += `<li>Type Flags: ${typeFlags[i]}`;
          const typeFlagsInt = HexToInt(typeFlags[i]);
          oggPacketString += (typeFlagsInt & 0x1 ? ` Continued packet` : ` Fresh packet`);
          oggPacketString += (typeFlagsInt & 0x2 ? `, first page` : ``);
          oggPacketString += (typeFlagsInt & 0x4 ? `, last page` : ``);
          oggPacketString += `</li>`;

          oggPacketString += `<li>Granule Position: ${granulePositions[i]}</li>`;
          oggPacketString += `<li>Stream Serial: ${streamSerials[i]}</li>`;
          oggPacketString += `<li>Page Number: ${pageNumbers[i]}</li>`;
          oggPacketString += `<li>CRC: ${crcChecksums[i]}</li>`;
          oggPacketString += `<li>Segment: ${pageSegments[i]}</li>`;
          
          oggPacketString.replace(/4F70757348656164/g, "<br/>O p u s H e a d ");
          oggPacketString.replace(/4F70757354616773/g, "<br/>O p u s T a g s ");
          
          document.getElementById(`oggPacket${i}`).innerHTML += oggPacketString;
        });
      
        console.log(`oggVersions: ${versions}`);
        console.log(`oggTypeFlags: ${typeFlags}`);
        console.log(`oggGranulePositions: ${granulePositions}`);
        console.log(`oggStreamSerials: ${streamSerials}`);
        console.log(`oggPageNumbers: ${pageNumbers}`);
        console.log(`oggCrcChecksums: ${crcChecksums}`);
        console.log(`oggPageSegments: ${pageSegments}`);
      }
    };
    reader.readAsArrayBuffer(file.slice(start, stop));
  })();
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
       ,'<p>', 'Name: ', file.name, '</p>'
       ,'<p>', 'Type: ', file.type || "n/a", '</p>'
       ,'<p>', 'Size: ', file.size.toLocaleString(), ' bytes.', '</p>'
       ,'<p>', 'Last Modified: ', fileDate.toLocaleString(), '</p>'
       ,'<div id="header', fileIndex, '"></div>'
       ,'</li>'
      ].join('');

      document.getElementById("list").innerHTML += headerString;

      if ( file.type == "audio/ogg"
        || file.type == "audio/wav"
      ) {
        //save file to a URL, to feed to audio tag source
        const fileURL = window.URL.createObjectURL(file);

        const audioTag = `<audio id="audio${fileIndex}" src="${fileURL}" controls></audio>`;

        document.getElementById("list").innerHTML += audioTag;
      }

      if ( file.type == "audio/ogg"
        || file.type == "audio/wav"
      ) {
        parseFile (fileIndex, file);
      } else {
        console.log (`Not parsing file ${file.name} because its type is "${file.type}".`);
      }
    }
  }
}

document.getElementById("filePicker").addEventListener("change", loadFiles, false);
