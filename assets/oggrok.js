// Check for the various File API support.
var us = "Unsupported APIs:"
if (!window.File) us += "\n - File";
if (!window.FileReader) us += "\n - FileReader";
if (!window.FileList) us += "\n - FileList";
if (!window.Blob) us += "\n - Blob";
if (us != "Unsupported APIs:") alert(us);

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push(
	  '<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - '
	  ,f.size.toLocaleString(), ' bytes</li>'
	  );
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('files').addEventListener('load', handleFileSelect, false);
document.getElementById('files').addEventListener('change', handleFileSelect, false);