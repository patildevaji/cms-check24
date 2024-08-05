const fs = require('fs');
const path = require('path');

let contents = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/contents.json'), 'utf-8'));

exports.getContents = (req, res) => {
    res.send(contents);
};

exports.addContent = (req, res) => {
    const content = req.body;
    content.id = contents.length ? contents[contents.length - 1].id + 1 : 1; 
    contents.push(content);
    res.send(contents);
};

exports.updateContent = (req, res) => {
    const { id } = req.params;
    const newContent = req.body;
    contents = contents.map(content => content.id == id ? { ...content, ...newContent } : content);
    res.send(contents);
};

exports.deleteContent = (req, res) => {
    const { id } = req.params;
    contents = contents.filter(content => content.id != id);
    res.send(contents);
};
