## Oggrok
A file analyser specialising in the [Ogg Opus](https://opus-codec.org/) format.

Try it [here](https://misterzeus.github.io/Oggrok/).

## Rough Spec

You should be able to pick an Opus file off your hard drive and load it into your browser to peek at what's inside it.
The file's tree structure should be made apparent i.e. the Ogg packets and their settings, the Opus-to-Ogg mapping headers, and the Opus data within the Ogg payloads.

Perhaps Oggok should go to the extra effort of parsing the Opus packet headers, to show further what's going on with the compressed audio contained in them.

The hierarchy of the data is:
- File and its summary data (size, MIMEtype, number of Ogg packets)
- Ogg packet, with its headers and lacing values
- Ogg lacing value payloads
- Opus frames and their headers

## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/MisterZeus/Oggrok/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/MisterZeus/Oggrok/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
