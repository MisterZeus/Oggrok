// Check for the various File API support.
var supported = "Supported APIs:"
if (window.File) supported += "\n - File";
if (window.FileReader) supported += "\n - FileReader";
if (window.FileList) supported += "\n - FileList";
if (window.Blob) supported += "\n - Blob";
alert(supported);
